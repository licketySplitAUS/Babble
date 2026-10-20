import test from 'node:test';
import assert from 'node:assert/strict';
import { routingRules } from './clues-routing.mjs';

test('legacy routes remain unmodified until enabled; preview, API and assets are independently available', () => {
  assert.doesNotMatch(routingRules(false), /^\/babbleclues /m);
  assert.match(routingRules(true), /^\/babbleclues https:\/\/selfserveclues.netlify.app\/history-preview.html 200!/m);
  assert.match(routingRules(true), /\/babbleprintableclues .*\?print=1 200!/);
  assert.match(routingRules(false), /\/new-babbleclues /);
  assert.match(routingRules(true), /\/history-api\/\* .*\/history-api\/:splat 200!/);
});
