import { type McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import z from "zod/v3";
import { CustomerService } from "../../application/customerService.ts";

export function registerCreateCustomersTool(
    server: McpServer,
    service: CustomerService
) {
    server.registerTool(
        "create_customer",
        {
            description: "Create customer",
            inputSchema: {
                name: z.string().describe('Full name of the customer'),
                phone: z.string().describe('Phone number of the customer')
            },
            outputSchema: {
                id: z.string().describe('MongoDB ObjectID of newerly created customer'),
                message: z.string().describe('Confirmation message')
            }
        },
        async ({ name, phone }) => {
            try {
                const customer = await service.createCustomer({ name, phone });
                return {
                    content: [{
                        type: "text",
                        text: JSON.stringify(customer)
                    }],
                    structuredContent: customer
                }
            } catch (error) {
                return {
                    isError: true,
                    content: [{
                        type: "text",
                        text: `Failed to list customers: ${error instanceof Error ? error.message : String(error)}`
                    }]

                }
            }
        }
    )
}