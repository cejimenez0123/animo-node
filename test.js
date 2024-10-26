// const YOUR_API_KEY = "API KEY";

// const messages = [
//   {
//     role: "system",
//     content: "You are an artificial intelligence assistant and you need to engage in a helpful, detailed, polite conversation with a user."
//   },
//   {
//     role: "user",
//     content: "Please explain, the theory of natural selection as if I were 12 years old"
//   }
// ];

// fetch("https://api.perplexity.ai/chat/completions", {
//   method: "POST",
//   headers: {
//     "Authorization": `Bearer ${YOUR_API_KEY}`,
//     "Content-Type": "application/json"
//   },
//   body: JSON.stringify({
//     model: "llama-3.1-sonar-large-128k-online",
//     messages: messages
//   })
// })
// .then(response => response.json())
// .then(data => console.log(JSON.stringify(data)))
// .catch(error => console.error('Error:', error));