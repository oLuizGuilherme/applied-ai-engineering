console.assert(
    process.env.OPENROUTER_API_KEY, "OPENROUTER_API_KEY is not set in env variables"
)

export type ModelConfig = {
    apiKey: string;
    httpReferer: string;
    xTitle: string;
    port: number;
    host: string;
    models: string[];
    temperature: number;
    maxTokens: number;
    systemPrompt: string;

    provider: {
        sort: {
            by: string;
            partition: string;
        }
    }
}

export const config = {
    apiKey: process.env.OPENROUTER_API_KEY!,
    httpReferer: 'http://pos-ia.com',
    xTitle: 'Smart Model Router Gateway',
    port: 3001,
    host: '0.0.0.0',
    models: [],
    temperature: 0.7,
    maxTokens: 50,
    systemPrompt: 'You are a helpful assistant.',
    provider: {
        sort: {
            by: 'price',
            partition: 'none'
        }
    }
}