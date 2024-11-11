const {GoogleAuth,OAuth2Client} = require('google-auth-library');


module.exports = async function main() {

// const auth = new GoogleAuth({  
//     credentials:{
//       client_email:process.env.GOOGLE_CLIENT_EMAIL,
//       private_key:process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
//     },
//     scopes: ["https://www.googleapis.com/auth/userinfo.email",
//     "https://www.googleapis.com/auth/userinfo.profile",
//    "https://www.googleapis.com/auth/calendar",
//    'https://www.googleapis.com/auth/cloud-platform'
//   ]});

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  return client
}