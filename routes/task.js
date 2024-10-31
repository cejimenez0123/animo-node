const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const prisma = require("../db")
const router = express.Router()



module.exports = function(authMiddleware){

        router.post("/",authMiddleware, async (req,res)=>{
            const { name,link,description,priority,timeOfEvent,completionDate,complexity,dueDate,place,isLowFocus,isWork}= req.body

           let task = await prisma.task.create({data:{
                name:name,
                link:link,
                description:description,
                priority:priority,
                timeOfEvent:timeOfEvent,
                completionDate:completionDate,
                complexity:complexity,
                dueDate:dueDate,
                place:place,
                isLowFocus:isLowFocus,
                isWork
                
            }})
            res.json({task})
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
    
        router.get("/:id/energy/:eng/mode/:mode",async (req,res)=>{
            let isLowFocus = true
            let isWork = false
            if(req.params.eng.toLowerCase().includes("high")){
                isLowFocus=false
            }
            if(req.params.mode.toLowerCase().includes("work")){
                isWork=true
            }
            let tasks = await prisma.task.findMany({where:{
                AND:{
                    parent:{
                        id:{
                            equals: req.params.id
                        }
                    },
                    isLowFocus:isLowFocus,
                    isWork:isWork,
                    user:{
                        id:{
                            equals:null
                        }
                    }
                }
            }})
            console.log(tasks)
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
           
            let tasks =  prisma.task.findMany({where:{
                    AND:{id:{
                        equals: req.params.id,
                    },
                    isLowFocus:isLowFocus,
                    isWork:isWork,
                    OR:{
                        userId:{
                            equals:req.user.id
                        }
                        ,
                        userId:{
                            equals:null
                        }
                    }}}})

            res.json({tasks})
        })
        router.get("/low-relax",async (req,res)=>{
            const tasks = await prisma.task.findMany({where:{
                isLowFocus:true,
                isWork:false
            }})
            res.json({tasks})
        })
        router.get("/low-work",async (req,res)=>{
            const tasks =  prisma.task.findMany({where:{
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