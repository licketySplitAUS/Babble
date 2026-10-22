const script = '<script defer src="https://selfserve.r46.me/clues-celebration.js"></script>';
export function withCluesCelebration(html) {
  if (!/function\s+AddBabbleWord\s*\(/.test(html) || html.includes('clues-celebration.js')) return html;
  return html.replace(/<\/head\s*>/i, match => script + '\n' + match);
}
