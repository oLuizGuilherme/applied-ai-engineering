import { config } from "./config.ts";
import { OpenRouterService } from "./openRouterService.ts";
import { createServer } from "./server.ts";

const openRouterService = new OpenRouterService(config);
const app = createServer(openRouterService);

await app.listen({ port: config.port, host: config.host });
console.log(`Server listening on port ${config.port}`);

// app.inject({
//     method: 'POST',
//     url: '/chat',
//     body: { question: 'What is the capital of France?' }
// }).then((response) => {
//     console.log('Response:', response.statusCode);
//     console.log('Response body:', response.body);
// });