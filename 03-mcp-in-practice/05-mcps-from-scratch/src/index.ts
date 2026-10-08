import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { server } from "./mcp.ts";

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);

    console.error('Encrypt MCP server running on stdio transport...');
}

main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});