const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const prisma = require("../db");
const WorkStatusTypeCheck = require('../util/WorkStatusTypeCheck');
const SedentaryCheck = require('../util/SedentaryCheck');
const {google} = require('googleapis');
const https = require("https")
const axios = require("axios")
// module.exports = function (passport){
const router = express.Router()

module.exports = function(
 { authMiddleware,googleMiddleware}){
// router.get("/",async (req, res)=>{
//   try{

router.get("/",authMiddleware,async (req, res) => {
  try{
      const token = req.headers.authorization.split(" ")[1]
      jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
        if (err) {
          
         res.status(401).json({   name: 'TokenExpiredError',
         message: 'jwt expired'})
        }else{
          res.status(200).json({   
            name: 'TokenSuccess',
            message: 'Token Acitive',
          user:req.user})
        }
      })
    }catch(e){
      res.json({message:e.message})
    }
  
})
router.get("/google/token/:code",async(req,res)=>{
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "http://localhost:5173"
  );

  let data={
    grant_type:"authorization_code",
    code: req.params.code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret:process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri:"http://localhost:3000"
  }
  let response = await axios.post("https://accounts.google.com/o/oauth2/token",{
    data:data
  })

  // const scopes = [
  //   'https://www.googleapis.com/auth/userinfo.email',
  //    'https://www.googleapis.com/auth/userinfo.profile',
  //   'https://www.googleapis.com/auth/calendar'
  // ];
  // const {tokens} = await oauth2Client.getToken(req.params.code)
  // oauth2Client.setCredentials(tokens);
  res.json({tokens:response.data})
})
// router.get("/google/user/:code",async(req,res)=>{
//   axios.get('https://www.googleapis.com/userinfo/v2/me', {
//     headers: {
//         Authorization: `Bearer ${accessToken}`
//     }
// })
//})
router.get("/task/schedule",authMiddleware,async(req,res)=>{

  const tasks = await prisma.task.findMany({
    where: {
      userId:req.user.id,
      OR:[
        {NOT:{
          dueDate:null
        }},
        {AND:{
          NOT:{
            startTime:null,
            endTime:null
          }
          
        }}
      ]
   
    },
  });
  res.json({tasks})
})

router.put("/",authMiddleware,async (req,res)=>{

  const {preferredName,relationshipStatus,sedentaryLevel,workStatus,dob}=req.body
  const work = WorkStatusTypeCheck(workStatus)
  const level = SedentaryCheck(sedentaryLevel)
  const date = new Date(dob)
  const user = await prisma.user.update({where:{
    id:req.user.id
  },data:{
    preferredName:preferredName,
    relationshipStatus:relationshipStatus,
    workStatus:work,
    sedentaryLevel:level,
    dob:date
  }})
  
  res.json({user})
})
router.post('/register', async (req, res) => {
    const { email, password} = req.body;
  
    try {
      // Validate input and ensure uniqueness
      if (!email || !password) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
  
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(409).json({ message: 'email already exists' });
      }
  
      // Hash password securely (at least 10 rounds)
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create new user in Prisma
      const user = await prisma.user.create({
        data: { email, password: hashedPassword },
      });
      
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '23h' });
      console.log(token)
      console.log(user)

      res.status(201).json({ message: 'User registered successfully', token,user }); // Securely send token in header
    } catch (error) {
      console.error(error); // Log error for debugging
      res.status(500).json({ message: 'Registration failed' });
    }
});
router.get("/:id/task",authMiddleware,async(req,res)=>{

  let tasks = prisma.task.findMany({where:{
    user:{
      id:{
        equals:req.user.id
      }
    }
  }})
  res.json({tasks})
})
router.post('/session', async (req, res) => {
    const { email, password } = req.body;
    try {
         const user = await prisma.user.findUnique({ where: { email:email.toLowerCase() } });
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '2d' });
            res.json({ token });
        } catch (error) {
            res.status(402).json({ message: 'Error logging in' });
        }
    });

    router.post("/logout", authMiddleware,async function (req, res, next) {
        req.user =null
        res.json({message:"Success"})
    })  
    return router
}