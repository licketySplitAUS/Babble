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

test('Expert guide and illustrations are available on the clues domain in both publication modes', () => {
  for (const enabled of [false, true]) {
    const rules = routingRules(enabled);
    assert.match(rules, /^\/babble-expert\.html https:\/\/selfserveclues.netlify.app\/babble-expert\.html 200!/m);
    assert.match(rules, /^\/expert-guide\/\* https:\/\/selfserveclues.netlify.app\/expert-guide\/:splat 200!/m);
    assert.match(rules, /^\/clue-slot-entry\.js https:\/\/selfserveclues.netlify.app\/clue-slot-entry\.js 200!/m);
  }
});
