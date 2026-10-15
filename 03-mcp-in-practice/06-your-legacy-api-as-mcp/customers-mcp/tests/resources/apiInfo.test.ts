import { Client } from "@modelcontextprotocol/sdk/client";
import assert from "node:assert";
import { after, before, describe, it } from "node:test";
import { createTestClient } from "../helpers.ts";

describe('Customer Resources', () => {
    let client: Client;

    before(async () => {
        client = await createTestClient();
    });

    after(async () => {
        await client.close();
    });

    it('should list the customers://api-info resource', async () => {
        const { resources } = await client.listResources();
        const info = resources.find(r => r.uri === 'customers://api-info')

        assert.ok(
            info,
            'customers://api-info should exists');
        assert.deepStrictEqual(
            info.description,
            'Describes the customers rest API that this MCP server wraps',
            'Description sould be correct'
        )
    });
})