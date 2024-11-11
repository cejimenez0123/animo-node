const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const prisma = require("../db");
const WorkStatusTypeCheck = require('../util/WorkStatusTypeCheck');
const SedentaryCheck = require('../util/SedentaryCheck');
const{OAuth2Client} = require("google-auth-library")
// const oAuth2Client = require("../oauth")
const router = express.Router()

module.exports = function(
 { authMiddleware,googleMiddleware,passport}){
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

router.get("/google/callback", (req, res) => {
  res.redirect('/');
})

router.post("/register/google",async(req,res)=>{
  let {creds} = req.body
    try {
      const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        // Verify the token
  
        const ticket = await client.verifyIdToken({
            idToken: creds.credential,
            audience: creds.client_id
        });
        
        const payload = ticket.getPayload();
        const userId = payload['sub'];
        let user = await prisma.user.findFirst({where:{email:payload.email}})
        if(user){
          user = await prisma.user.update({where:{id:user.id},data:{
              googleId:userId
            }})
        }else{
         user = await prisma.user.create({data:{
            preferredName:payload.given_name,
            email:payload.email
            ,googleId:userId,
              }})
        }
        
      console.log(user)
        res.status(200).json({ message: 'User authenticated', user});
    } catch (error) {
      console.log(error)
        res.status(401).json({ message: 'User not authenticated', error: error.message });
    }
})
router.post('/auth/google', async (req, res) => {


  let {creds} = req.body
    try {
      const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        // Verify the token
  
        const ticket = await client.verifyIdToken({
            idToken: creds.credential,
            audience: creds.client_id
        });
        
        const payload = ticket.getPayload();
      
        const userId = payload['sub'];
       let user = await prisma.user.findFirst({where:{googleId:userId}})
      if(user==null){
        throw new Error("No User")
      }
        res.status(200).json({ message: 'User authenticated', user});
    } catch (error) {
      console.log(error)
        res.status(401).json({ message: 'User not authenticated', error: error.message });
    }
});

router.post('/google',async(req,res)=>{

  const {creds}=req.body
  const oAuth2Client = new OAuth2Client(
    keys.web.client_id,
    keys.web.client_secret,
    keys.web.redirect_uris[0]
  );

  // Generate the url that will be used for the consent dialog.
  const authorizeUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: 'https://www.googleapis.com/auth/userinfo.profile',
  });
  console.log("Creds",creds)
  // let tokens = await oAuth2Client.getToken(creds.client_id)
  // const client = google.accounts.oauth2.initTokenClient({
  //   client_id: process.env.GOOGLE_CLIENT_ID,
  //   scope: ['https://www.googleapis.com/auth/calendar.readonly',
  //   "https://www.googleapis.com/auth/userinfo.email",
  //   "https://www.googleapis.com/auth/userinfo.profile"],
  //   callback: (response) => {
   
  //   },
  // });
//   console.log("tokens",tokens)
//   oAuth2Client.on('tokens', (tokens) => {
    
//     if (tokens.refresh_token) {
//       // store the refresh_token in my database!
//       console.log(tokens.refresh_token);
//     }
//     console.log(tokens.access_token);
//   });
//   const url = `https://dns.googleapis.com/dns/v1/projects/${process.env.GOOGLE_PROJECT_ID}`;
// const response = await client.request({ url });
//   res.json({tokens:response})
 })


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