const express = require("express");
// let session = require('cookie-session');
const bodyParser = require("body-parser")
const passport = require("passport")
const cors = require('cors')
const LlamaAI = require('llamaai')
// const forkRoutes = require('./routes/fork.js')
// const userRoutes = require('./routes/user.js')
const createBucket = require("./gstorage")
const {setUpPassportLocal}= require("./middleware/authMiddleware.js")
// const multer = require('multer')

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


app.use(bodyParser.json());
app.use(logger);

app.get('/', async (req, res, next) => {
 ;

    const apiToken = 'LA-c310a31a758045d7b0e3422404b21ddf5d6f0184bf2c483789b900722c5bbc6f';
    const llamaAPI = new LlamaAI(apiToken);
    // Build the Request
    const apiRequestJson = {
        "messages": [
            {"role":"system","content":"You are an artificial intelligence assistant and you need to engage in a helpful, detailed, polite conversation with a user."},
            {"role": "user", "content": "Explain the Theory of Natural Selection as if I were 12 years old?"},
        ],
        "functions": [
            {
                "name": "explain science",
                "description": "Explain Science Theory",
                // "parameters": {
                //     "type": "object",
                //     "properties": {
                //         "location": {
                //             "type": "string",
                //             "description": "The city and state, e.g. San Francisco, CA",
                //         },
                //         "days": {
                //             "type": "number",
                //             "description": "for how many days ahead you wants the forecast",
                //         },
                //         "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]},
                //     },
                // },
                // "required": ["location", "days"],
            }
        ],
        "stream": false,
        "function_call": "answer question",
       };
     
       // Execute the Request
        let response = await llamaAPI.run(apiRequestJson)
        let data = response.json()
        res.json(data)
     
    // res.status(200).json({message:"Hello World"})
})
// app.use("/user", userRoutes(authMiddleware))
// app.use("/auth", authRoutes(authMiddleware));
// app.use("/fork",forkRoutes(authMiddleware))
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