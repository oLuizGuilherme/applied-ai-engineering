import Fastify from 'fastify';
import { OpenRouterService } from './openRouterService.ts';

export const createServer = (routerService: OpenRouterService) => {
    const app = Fastify({logger: false});

    app.post('/chat', {
        schema: {
            body: {
                type: 'object',
                required: ['question'],
                properties: {
                    question: { type: 'string' },
                },
            },
        }
    }, async (request, reply) => {
        try {
            const { question } = request.body as { question: string };
            const response = await routerService.generate(question);
            return reply.send(response);
        } catch (error) {
            return reply.code(500);
        }
    });

    return app;
}