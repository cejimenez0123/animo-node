
// const Together = require('together-ai');

// const together = new Together({ apiKey:""})

//  together.chat.completions.create({
//   model: "meta-llama/Llama-Vision-Free",
//   messages: [{role:"system",
//   content:"You're a task assistant tool. Whose purpose is to breakdown task into defined units and steps."},
//   { role: 'user', content: "Break the following tasks :["+"Run or Workout" +"]into steps that fit the following "+
//   `json:{
//     name: string,
//     link: string,
//     description: string,
//     priority: int?,
//     complexity: int?,
//     completionDate: DateTime?, 
//     isLowFocus: Boolean?
//     isWork: Boolean?
//   }. Assume the person does not know how to begin with but wants to start now. Name the steps to start quickly. Include no pleasantries or preamble. Only the json.` },],
//                                  }).then(completions=>{
//     console.log(JSON.stringify(completions.choices[0].message.content))
// })

