import test from 'node:test';
import assert from 'node:assert/strict';
import { expertButton, withExpertButton } from './expert-button.mjs';

const downloads = '<h3>Download Babble Expert</h3><a href="https://github.com/licketySplitAUS/BabbleExpert/releases/latest/download/BabbleExpert-Windows-Setup.exe">Download for Windows</a><a href="https://github.com/licketySplitAUS/BabbleExpert/releases/latest/download/BabbleExpert-macOS.dmg">Download for Mac</a>';
test('old and new generator sidebar blocks become one guide button without touching puzzle content', () => {
  for (const intro of ['<a href="/babble-expert.html">Babble Expert Information and Install Guides</a>', '<a href="https://youtu.be/IBgTrBk35uI">Intro video</a><a href="https://youtu.be/6ZK0IiQIkk4">Update demo</a>']) {
    const html = withExpertButton(`<html><head></head><body><div>Today's puzzle</div>${intro}${downloads}<h3>Handy Hint</h3></body></html>`);
    assert.equal((html.match(/class="babble-expert-button"/g) || []).length, 1);
    assert.ok(html.includes(expertButton));
    assert.ok(html.includes("<div>Today's puzzle</div>"));
    assert.ok(html.includes('<h3>Handy Hint</h3>'));
    assert.doesNotMatch(html, /Download for Windows|Download Babble Expert|youtu\.be/);
    assert.equal(withExpertButton(html), html, 'Repeated builds do not duplicate the button or stylesheet');
  }
});
test('pages without the Expert download block remain unchanged', () => {
  const html = '<html><head></head><body>Printable clues</body></html>';
  assert.equal(withExpertButton(html), html);
});
