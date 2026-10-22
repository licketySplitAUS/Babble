const script = '<script defer src="https://selfserve.r46.me/clues-celebration.js"></script>';
const identity = '<script defer src="https://selfserve.r46.me/browser-identity.js?v=2"></script>';
export function withCluesCelebration(html) {
  if (!/function\s+AddBabbleWord\s*\(/.test(html)) return html;
  html = html.replaceAll('https://selfserve.r46.me/browser-identity.js"', 'https://selfserve.r46.me/browser-identity.js?v=2"');
  if (html.includes('clues-celebration.js')) return html.includes('browser-identity.js') ? html : html.replace(script, () => identity + '\n' + script);
  return html.replace(/<\/head\s*>/i, match => identity + '\n' + script + '\n' + match);
}
