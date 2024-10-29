import LlamaAI from 'llamaai';

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
    llamaAPI.run(apiRequestJson)
    .then(response => response.json())
    .then(data => console.log(JSON.stringify(data)))
    .catch(error => {
        console.log(error)
      });
 