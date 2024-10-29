const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const prisma = require("../db")

// module.exports = function (passport){
const router = express.Router()

module.exports = function(authMiddleware){
router.get("/",async (req, res)=>{
  try{
  const token = req.headers.authorization.split(" ")[1]
  jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
    if (err) {
     res.status(401).json({   name: 'TokenExpiredError',
     message: 'jwt expired'})
    }else{
      res.status(200).json({   
        name: 'TokenSuccess',
        message: 'Token Acitive'})
    }
  })
}catch(e){
  res.json({message:e.message})
}
})
router.get("/",authMiddleware,async (req, res) => {
  res.json({user:req.user})
})
router.put("/",authMiddleware,async (req,res)=>{

  const {preferredName,relationshipStatus,sedentaryLevel,workStatus,dob}=req.body
  const user = prisma.user.update({where:{
    id:req.user.id
  },data:{
    preferredName:preferredName,
    relationshipStatus:relationshipStatus,
    workStatus:workStatus,
    sedentaryLevel:sedentaryLevel,
    dob:dob
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
  
      res.status(201).json({ message: 'User registered successfully', token }); // Securely send token in header
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
router.post('/login', async (req, res) => {
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

    router.post("/logout", async function (req, res, next) {

    })
    return router
}