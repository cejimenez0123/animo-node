const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const prisma = require("../db")
const router = express.Router()
const together = require("../together")


module.exports = function(authMiddleware){

        router.post("/",authMiddleware, async (req,res)=>{
            
            try{
            const { name,
                description,
                link,
                parentId,
                priority,
                complexity,
               
                startTime,
                endTime,
                dueDate,
                isLowFocus,
                isWork,
                }
            = req.body
            let desc = description
            if(desc.length<2){
               let completions = await together.chat.completions.create({
                    model: "meta-llama/Llama-Vision-Free",
                    messages: [{"role": "system", "content": "You're a task assistant."},{role: 'user', content: "Create a description for the task named here:["+name+
                                                          "] the description should not exceed 100 words long. Things that can "+
                                                      "be included in the description are benefits of the task and things that help you think about the tasks. Include no Pleasantries" },],
                                                   })
             desc = completions.choices[0].message.content
                  
            }
            let parentTask = {id: parentId}
            if(parentId==null){
            if(isLowFocus==true && isWork==true){
                parentTask = await prisma.task.findFirst({where:{name:"Work"}})
            }else if(isLowFocus==false &&isWork==false){
                parentTask= await prisma.task.findFirst({where:{name:"Relax"}})
            }else if(isWork==false&&isLowFocus==true){
                parentTask= await prisma.task.findFirst({where:{name:"Relax"}})
            }else if(isWork==true&&isLowFocus==false){
                parentTask= await prisma.task.findFirst({where:{name:"Work"}})
            }
        }
    
           let task = await prisma.task.create({data:{
                name:name,
                link:link,
                description:desc,
                priority:Number(priority),
                user:{
                    connect:{
                        id:req.user.id
                    }
                },
                complexity:Number(complexity),
                startTime:new Date(startTime),
                endTime:new Date(endTime),
                dueDate:new Date(dueDate),
                isLowFocus:isLowFocus,
                isWork:isWork,
                parent:{
                    connect:{
                        id: parentTask.id
                    }
                }
                
            }})
            res.json({task})
        }catch(error){
        
            res.json({error})
        }
        })
        router.get("/:id/children",authMiddleware,async(req,res)=>{

            const tasks = await prisma.task.findMany({where:{
                parentId:req.params.id
            }})
            res.json({tasks})
        })
        router.post("/:id/breakdown",authMiddleware,async(req,res)=>{

            const task = await prisma.task.findFirst({where:{
                id: req.params.id
            }})
            let completions = await together.chat.completions.create({
  model: "meta-llama/Llama-Vision-Free",
  messages: [{role:"system",
  content:"You're a mindfulness focused task assistant tool. Whose purpose is to breakdown task for novice to tasks."},
  { role: 'user', content: "Break the following tasks :["+task.name +"] this is a description of the task description:["+task.description +"] into steps that fit the following "+
  `json:{
    name: string,
    link: string,
    description: string,
    priority: int?,
    complexity: int?,
    completionDate: DateTime?, 
    isLowFocus: Boolean?
    isWork: Boolean?
  }. isLowFocus is for if you need high level of engangement to complete the task. Assume the person does not know how to begin with but wants to start now. Name the steps to start quickly. Include no pleasantries or preamble. Only the json.` },],
                                 })
            let json = JSON.parse(completions.choices[0].message.content)
            console.log(json)    
            let tasks = json.map(taskAi=>{
                    return prisma.task.create({data:{
                        name:taskAi.name,
                        description:taskAi.description,
                        link:taskAi.link,
                        priority: taskAi.priority,
                        complexity:taskAi.complexity,
                        parent:{
                            connect:{
                                id: req.params.id
                            }
                        }
                    }})
                })
            tasks = await Promise.all(tasks)
            console.log(tasks)
            res.json({tasks})
        })
        router.get("/energy",async (req,res)=>{
            let low  =   await prisma.task.findFirst({where:{name:"Low Energy"}})
            let high =   await prisma.task.findFirst({where:{name:"High Energy"}})
            let energy=[low,high]
            res.json({tasks:energy})
        })
        router.get("/mode",async (req,res)=>{
            let doNothing = await prisma.task.findFirst({where: {AND:{
                name:"Do Nothing",
                user:null
            }}})
            let relax = await prisma.task.findFirst({where: {AND:{
                name:"Relax",
                user:null
            }}})
            let work = await prisma.task.findFirst({where:
                {AND:{
                    name:"Work",
                    user:null
                }}
            })
            
            res.json({tasks:[doNothing,relax,work]})
        })
    
        router.get("/:id/energy/:eng/mode/:mode/public",async (req,res)=>{
            let isLowFocus = true
            let isWork = false
           
            if(req.params.eng.toLowerCase().includes("high")){
                isLowFocus=false
            }
            if(req.params.mode.toLowerCase().includes("work")){
                isWork=true
            }
            let tasks = await prisma.task.findMany({take:4,where:{
                AND:{
                    parent:{
                        id:{
                            equals: req.params.id
                        }
                    },
                    isLowFocus:isLowFocus,
                    isWork:isWork,
                    OR: [
                        { userId: null },
                        { userId: { isSet: false } }
                      ]
                  
                }
            }})
            res.json({tasks})
        })
      
        router.get("/:id/energy/:eng/mode/:mode/protected",authMiddleware,async (req,res)=>{
            let isLowFocus = true
            let isWork = false
            if(req.params.eng.toLowerCase().includes("high")){
                isLowFocus=false
            }
            if(req.params.mode.toLowerCase().includes("work")){
                isWork=true
            }
            let userTasks = await prisma.task.findMany({where:{
              AND:{
                parentId:{
                    equals:req.params.id
                },
               isLowFocus:isLowFocus,
               isWork:isWork,
               userId:req.user.id
              }  
            }})
            let nonUserTasks = await prisma.task.findMany({take:4,where:{
                AND:{
                    parent:{
                        id:{
                            equals: req.params.id
                        }
                    },
                    isLowFocus:isLowFocus,
                    isWork:isWork,
                    OR: [
                        { userId: null },
                        { userId: { isSet: false } }
                      ]
                  
                }
            }})
           let tasks =[...userTasks,...nonUserTasks].slice(0,4)
            res.json({tasks:tasks})
        })
        
        router.get("/low-relax",async (req,res)=>{
            const tasks = await prisma.task.findMany({where:{
                
                isLowFocus:true,
                isWork:false
            }})
            res.json({tasks})
        })
        router.get("/:id/protected",authMiddleware,async(req,res)=>{
                let task = await prisma.task.findFirst({where:{
                    AND:{
                        id:{
                            equals: req.params.id
                        },
                       OR:[
                        {userId:{equals:req.user.id}},
                        { userId: null },
                        { userId: { isSet: false } }
                       ] 
                        
                    }
                }})
              
                res.json({task})
        })
        router.get("/:id/public",async(req,res)=>{
            let task = await prisma.task.findFirst({where:{
                AND:{
                    id:{
                        equals: req.params.id
                    },
                   OR:[  { userId: null },
                    { userId: { isSet: false } }]
                }
            }})
            res.json({task})
        })
        router.get("/low-work",async (req,res)=>{
            const tasks = await prisma.task.findMany({where:{
                isLowFocus:true,
                isWork:true
            }})
            res.json({tasks})
        })
        router.get("/high-relax",async (req,res)=>{
            const tasks = prisma.task.findMany({where:{
                isLowFocus:false,
                isWork:false
            }})
            res.json({tasks})
        })
        router.get("/high-work",async (req,res)=>{
            const tasks = prisma.task.findMany({where:{
                isLowFocus:false,
                isWork:true
            }})
            res.json({tasks})
        })
        return router


}