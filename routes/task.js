const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const prisma = require("../db")
const router = express.Router()



module.exports = function(authMiddleware){

        router.post("/",authMiddleware, async (req,res)=>{
            const { name,link,description,priority,timeOfEvent,completionDate,complexity,dueDate,place,isLowFocus,isWork}= req.body

           let task = prisma.task.create({data:{
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
        router.get("/low-relax",async (req,res)=>{
            const tasks = prisma.task.findMany({where:{
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