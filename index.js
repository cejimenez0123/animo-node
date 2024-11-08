const express = require("express");
let session = require('cookie-session');
const bodyParser = require("body-parser")
const passport = require("passport")
const cors = require('cors')
const {setUpPassportLocal}= require("./middleware/authMiddleware.js")
const Enviroment =require("./Enviroment.js")
const taskRoutes = require("./routes/task.js")
const userRoutes = require("./routes/user.js")
const app = express();
const PORT = process.env.PORT
const {setUpPassportGoogle} = require("./middleware/googleMiddleware.js")
app.use(cors({origin:'http://localhost:5173',credentials:true}))
app.use((req, res, next) => {
  
  res.setHeader("Access-Control-Allow-Origin", "*")
res.setHeader("Access-Control-Allow-Credentials", "true");
next();
})

app.use(bodyParser.urlencoded({ extended: false }))
setUpPassportGoogle(passport)
setUpPassportLocal(passport);
const logger = (req, _res, next) => {
    const time = new Date().toLocaleTimeString();
    console.log(`${time} ${req.method}: ${req.url}`);
    next();
    };
  app.use(bodyParser.json());
app.use(logger);
const authMiddleware = passport.authenticate('bearer', { session: false });
const googleMiddleware =  passport.authenticate('google', { scope: ['profile', 'email'] })
app.get('/auth/google',googleMiddleware)
app.get('/auth/google/callback', function() {
  passport.authenticate('google', {
      successRedirect: '/',
      failureRedirect: "/signin"
  });
});
app.get('/logout', function (req, res) {
  req.logOut();
  res.redirect('/');
});

 


app.get('/', async (req, res, next) => {
 ;
   res.json({message:"Success"})
})
app.use("/task",taskRoutes(authMiddleware))
app.use("/user",userRoutes({authMiddleware,googleMiddleware}))



app.use(
    session({
    secret: process.env.JWT_SECRET,resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
    }))
app.use(passport.session());
app.use(passport.initialize());
app.listen(PORT, '0.0.0.0', () => {
console.log(`Server is running`)
})
module.exports = app