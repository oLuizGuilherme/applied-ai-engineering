import { createServer } from "./server.ts";

const app = createServer();

await app.listen({ port: 3001, host: '0.0.0.0' });
console.log(`Server listening on port 3001`);

// app.inject({
//     method: 'POST',
//     url: '/chat',
//     body: { question: 'What is the capital of France?' }
// }).then((response) => {
//     console.log('Response:', response.statusCode);
//     console.log('Response body:', response.body);
// });