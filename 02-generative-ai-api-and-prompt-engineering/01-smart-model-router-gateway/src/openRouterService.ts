import { OpenRouter } from "@openrouter/sdk";
import { config, type ModelConfig } from "./config.ts";

export class OpenRouterService {

    private client: OpenRouter;
    private config: ModelConfig;

    constructor(configOverride: ModelConfig) {
        this.config = configOverride ?? config;
        this.client = new OpenRouter({
            apiKey: this.config.apiKey,
            httpReferer: this.config.httpReferer,
            xTitle: this.config.xTitle
        })
    }

    async generate(prompt: string) {

    }
}