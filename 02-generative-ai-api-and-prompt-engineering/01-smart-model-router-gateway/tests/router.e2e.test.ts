import test from "node:test";
import assert from "node:assert";
import { createServer } from "../src/server.ts";
import { type ModelConfig, config } from "../src/config.ts";
import { type LLMResponse, OpenRouterService } from "../src/openRouterService.ts";

console.assert(
    process.env.OPENROUTER_API_KEY, "OPENROUTER_API_KEY is not set in env variables"
)

test('Routes to cheapest model by default', async () => {
    const customConfig: ModelConfig = {
        ...config,
        provider: {
            ...config.provider,
            sort: {
                ...config.provider.sort,
                by: 'price',
            }
        }
    }
    const routerService = new OpenRouterService(customConfig);
    const app = createServer(routerService);

    const response = await app.inject({
        method: 'POST',
        url: '/chat',
        body: { question: 'What is the capital of France?' }
    });
    assert.equal(response.statusCode, 200);
    const body = response.json() as LLMResponse;

    assert.equal(body.model, 'minimax/minimax-m2.7:free');
})

test('Routes to higher throughput model by default', async () => {
    const customConfig: ModelConfig = {
        ...config,
        provider: {
            ...config.provider,
            sort: {
                ...config.provider.sort,
                by: 'throughput',
            }
        }
    }
    const routerService = new OpenRouterService(customConfig);

    const app = createServer(routerService);

    const response = await app.inject({
        method: 'POST',
        url: '/chat',
        body: { question: 'What is the capital of France?' }
    });
    assert.equal(response.statusCode, 200);
    const body = response.json() as LLMResponse;

    assert.equal(body.model, 'minimax/minimax-m2.7:free');
})