const express = require("express");
let session = require('cookie-session');
const bodyParser = require("body-parser")
const passport = require("passport")
const cors = require('cors')
const authRoutes = require('./routes/auth.js')
const forkRoutes = require('./routes/fork.js')
const userRoutes = require('./routes/user.js')
const createBucket = require("./gstorage")
const {setUpPassportLocal}= require("./middleware/authMiddleware.js")
const multer = require('multer')
const multerGoogleCloudStorage = require("multer-cloud-storage")

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
createBucket(process.env.BUCKET_NAME)
.then(bucket => {
    const upload = multer({
        storage: multerGoogleCloudStorage.storageEngine({bucket:bucket,projectId:process.env.PROJECT_ID
    })
})
app.use(upload.any())
})
.catch(error => {
 
});

const logger = (req, _res, next) => {
    const time = new Date().toLocaleTimeString();
    console.log(`${time} ${req.method}: ${req.url}`);
    next();
    };
const authMiddleware = passport.authenticate('bearer', { session: false }); // Sessionless authentication


app.use(bodyParser.json());
app.use(logger);
app.get('/', (req, res, next) => {

    res.status(200).json({message:"Hello World"})
})
app.use("/user", userRoutes(authMiddleware))
app.use("/auth", authRoutes(authMiddleware));
app.use("/fork",forkRoutes(authMiddleware))
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