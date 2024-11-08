const Together = require('together-ai');


const together = new Together({ apiKey: process.env.TOGETHER_TOKEN})


module.exports = together