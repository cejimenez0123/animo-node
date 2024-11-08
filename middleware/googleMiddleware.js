var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const prisma = require("../db");



function checkIfAuthenticatedGoogle(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    return res.redirect("/login");
  }
}
function setUpPassportGoogle(passport){
passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback",
    passReqToCallback   : true
  },
 async function(request, accessToken, refreshToken, profile, done) {
  

    try{
    let user = await prisma.user.findFirst({where:{
        googleId: profile.id
    }}).t
    if(user==false){
       user= await prisma.user.create({data:{
            email:profile.email,
            googleId:profile.id
        }})
    }

      done(null, user);
    }catch(error){
        done(error,null)
    }
  }
));
passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    prisma.user.findUnique({ where: { id } }) // Fetch user data from DB
      .then(user => done(null, user))
      .catch(error => done(error,null));
  });


}
module.exports ={setUpPassportGoogle,checkIfAuthenticatedGoogle}