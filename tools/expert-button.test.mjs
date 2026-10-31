import test from 'node:test';
import assert from 'node:assert/strict';
import { expertButton, withExpertButton, infoLink } from './expert-button.mjs';
import { withClueSlotEntry } from './clue-slot-entry.mjs';

test('slot entry enhancement survives daily generation without changing puzzle content', () => {
  const source = '<html><head></head><body><script>function AddBabbleWord(word) {}</script>Today\'s clues</body></html>';
  const result = withClueSlotEntry(source);
  assert.match(result, /clue-slot-entry\.js/);
  assert.ok(result.endsWith(source.slice(source.indexOf('</head>'))));
  assert.equal(withClueSlotEntry(result), result);
  assert.equal(withClueSlotEntry('<head></head>Printable clues'), '<head></head>Printable clues');
});

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


test('Info link stays last and right-aligned outside the legacy center tag after daily rebuilds', () => {
  const source = '<html><head></head><body><div id="g_sidebar"><p>Sidebar content</p></center>\n</div><footer>Footer</footer></body></html>';
  const result = withExpertButton(source);
  assert.ok(result.includes('</center>\n' + infoLink + '\n</div>'));
  assert.equal((result.match(/class="lickety-info-link"/g) || []).length, 1);
  assert.ok(result.includes('<footer>Footer</footer>'));
  assert.equal(withExpertButton(result), result);
});
