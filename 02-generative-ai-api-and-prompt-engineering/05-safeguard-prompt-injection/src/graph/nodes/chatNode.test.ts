import assert from 'node:assert/strict';
import test from 'node:test';
import { HumanMessage } from '@langchain/core/messages';
import { createChatNode } from './chatNode.ts';
import type { OpenRouterService } from '../../services/openrouterService.ts';

test('adds the generated response to the message state', async () => {
  const service = {
    generate: async () => 'The package version is 1.2.0.',
  } as OpenRouterService;
  const chatNode = createChatNode(service);

  const result = await chatNode({
    messages: [new HumanMessage('What is the version in package.json?')],
    user: {
      username: 'erickwendel',
      role: 'admin',
      permissions: ['read_package'],
      displayName: 'Erick Wendel',
    },
    guardrailCheck: null,
    guardrailsEnabled: true,
  });

  assert.equal(result.messages?.length, 1);
  assert.equal(result.messages?.[0]?.content, 'The package version is 1.2.0.');
});
