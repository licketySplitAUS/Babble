const script = '<script defer src="https://selfserve.r46.me/clue-slot-entry.js"></script>';
export function withClueSlotEntry(html) {
  if (!/function\s+AddBabbleWord\s*\(/.test(html) || html.includes('clue-slot-entry.js')) return html;
  return html.replace(/<\/head\s*>/i, match => script + '\n' + match);
}
