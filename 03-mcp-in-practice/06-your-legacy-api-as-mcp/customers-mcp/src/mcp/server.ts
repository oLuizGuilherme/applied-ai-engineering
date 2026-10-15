import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CustomerService } from "../application/customerService.ts";
import { registerApiInfoResource } from "./resources/apiInfo.ts";
import { registerCreateCustomersTool } from "./tools/createCustomer.ts";
import { registerGetCustomersTool } from "./tools/getCustomer.ts";
import { registerListCustomersTool } from "./tools/listCustomers.ts";
import { registerFindCustomerPrompt } from "./prompts/findCustomer.ts";
import { registerUpdateCustomerTool } from "./tools/updateCustomer.ts";
import { retgisterDeleteCustomerTool } from "./tools/deleteCustomer.ts";

const BASE_URL = "http://localhost:9999/v1";
const service = new CustomerService(BASE_URL);

export const server = new McpServer({
    name: "@erickwendel/ew-customers-mcp",
    version: "0.0.1",
});

registerListCustomersTool(server, service);
registerApiInfoResource(server, BASE_URL);
registerCreateCustomersTool(server, service);
registerGetCustomersTool(server, service);
registerUpdateCustomerTool(server, service);
retgisterDeleteCustomerTool(server, service);
registerFindCustomerPrompt(server);