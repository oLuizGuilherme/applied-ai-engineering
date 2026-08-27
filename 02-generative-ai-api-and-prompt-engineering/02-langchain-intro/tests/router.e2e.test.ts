import test from "node:test";
import assert from "node:assert";
import { createServer } from "../src/server.ts";


test('Command upper transforms messages into UPPERCASE', async () => {
    const app = createServer();
    const msg = 'make this message UPPER please!'

    const expected = msg.toUpperCase();

    const response = await app.inject({
        method: 'POST',
        url: '/chat',
        body: { question: msg }
    });
    assert.equal(response.statusCode, 200);

    assert.equal(response.body, expected);
})

test('Command lower transforms messages into lowercase', async () => {
    const app = createServer();
    const msg = 'MAKE THIS MESSAGE TO LOWERCASE!'

    const expected = msg.toLowerCase();

    const response = await app.inject({
        method: 'POST',
        url: '/chat',
        body: { question: msg }
    });
    assert.equal(response.statusCode, 200);

    assert.equal(response.body, expected);
})

test('Command upper transforms messages into UNKNOWN', async () => {
    const app = createServer();
    const msg = 'HELLO THERE!'

    const expected = 'Unknown command. Please use "uppercase" or "lowercase".';

    const response = await app.inject({
        method: 'POST',
        url: '/chat',
        body: { question: msg }
    });
    assert.equal(response.statusCode, 200);

    assert.equal(response.body, expected);
})