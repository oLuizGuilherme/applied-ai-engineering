import { Client } from "@modelcontextprotocol/sdk/client";
import assert from "node:assert";
import { after, before, describe, it } from "node:test";
import { type CustomerMutation, type Customer } from "../../src/domain/customer.ts";
import { createTestClient } from "../helpers.ts";

type CustomersResult = { structuredContent: { customers: Customer[] } }
type CustomerResult = { structuredContent: { customer: Customer } }
type CustomerMutationResult = { structuredContent: CustomerMutation }

describe('Customer MCP Suite', () => {
    let client: Client;

    before(async () => {
        client = await createTestClient();
    });

    after(async () => {
        await client.close();
    });

    it('should list customers', async () => {
        const result = await client.callTool({
            name: 'list_customers',
            arguments: {}
        }) as unknown as CustomersResult;

        assert.ok(
            Array.isArray(result.structuredContent.customers),
            'Expected at least one customer');
    });

    it('should create a customer', async () => {
        const customer = {
            name: 'Ana',
            phone: '999-000-111'
        };
        const result = await client.callTool({
            name: 'create_customer',
            arguments: customer
        }) as unknown as CreateCustomerResult;

        assert.ok(
            result.structuredContent.id,
            'Should contain an id');
        assert.deepStrictEqual(
            result.structuredContent.message,
            `user ${customer.name} created!`);
    });

    let createdID = '';

    it('should create a customer', async () => {
        const customer = {
            name: 'Marcus Aurelius',
            phone: '7777-7777'
        };

        await client.callTool({
            name: 'create_customer',
            arguments: customer
        });

        const result = await client.callTool({
            name: 'get_customer',
            arguments: {
                name: customer.name
            }
        }) as unknown as CustomerResult;

        assert.ok(
            result.structuredContent.customer._id,
            'Should contain an id');

        assert.deepStrictEqual(
            result.structuredContent.customer.name,
            customer.name,
            'Should match the customer ID');

        createdID = result.structuredContent.customer._id;
    });

    it('should update a customer', async () => {
        const customer = {
            _id: createdID,
            name: 'Epictetus',
            phone: '1234-4321'
        };

        const result = await client.callTool({
            name: 'update_customer',
            arguments: customer
        }) as unknown as CustomerMutationResult ;

        assert.ok(
            result.structuredContent.message,
            'Should contain an id');

        assert.deepStrictEqual(
            result.structuredContent.id,
            createdID,
            'Should match the customer ID');
    });

    it('should delete a customer', async () => {
        const result = await client.callTool({
            name: 'delete_customer',
            arguments: { _id: createdID }
        }) as unknown as CustomerMutationResult ;

        assert.deepStrictEqual(
            result.structuredContent.message,
            `User ${createdID} deleted!`,
            'Should match the delete message');

        assert.deepStrictEqual(
            result.structuredContent.id,
            createdID,
            'Should match the customer ID');
    });

})