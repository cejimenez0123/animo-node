const express = require("express");
let session = require('cookie-session');
const bodyParser = require("body-parser")
const passport = require("passport")
const cors = require('cors')
const {setUpPassportLocal}= require("./middleware/authMiddleware.js")
const taskRoutes = require("./routes/task.js")
const userRoutes = require("./routes/user.js")
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))


const logger = (req, _res, next) => {
    const time = new Date().toLocaleTimeString();
    console.log(`${time} ${req.method}: ${req.url}`);
    next();
    };
const authMiddleware = passport.authenticate('bearer', { session: false }); // Sessionless authentication

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  })
app.use(bodyParser.json());
app.use(logger);

app.get('/', async (req, res, next) => {
 ;

   res.json({message:"Success"})
    // Build the Request
    
     
    // res.status(200).json({message:"Hello World"})
})
app.use("/task",taskRoutes(authMiddleware))
app.use("/user",userRoutes(authMiddleware))

setUpPassportLocal(passport);
app.use(
    session({
    secret: process.env.JWT_SECRET??"SDFSDGds",resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
    }))
app.use(passport.session());
app.use(passport.initialize());
app.listen(PORT, '0.0.0.0', () => {
console.log(`Server is running`)
})
module.exports = app