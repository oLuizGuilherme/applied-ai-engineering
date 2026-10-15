import { type McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CustomerQuerySchema } from "../../domain/customer.ts";

export function registerFindCustomerPrompt(server: McpServer) {
    server.registerPrompt(
        "find_customer_prompt",
        {
            description: "Prompt to search a customer using any combination of _id, name or phone",
            argsSchema: CustomerQuerySchema.shape
        },
        (query) => ({
            messages: [
                {
                    role: 'user',
                    content: {
                        type: 'text',
                        text: `please find the customer matching the following query using the get_customer or list_customer tool.\nQuery: ${JSON.stringify(query)}`,
                    }
                }
            ]
        })
    )
}