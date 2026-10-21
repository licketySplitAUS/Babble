export const expertButton = '<div class="expert-button-wrap"><a class="babble-expert-button" href="https://r46.me/babble-expert.html" target="_blank" rel="noopener noreferrer"><span>Babble Expert</span></a></div>';
const stylesheet = 'https://selfserve.r46.me/expert-guide/babble-expert-button.css';
// The daily legacy generator can reintroduce its old links. Normalize that
// specific sidebar block at build time so the button survives puzzle updates.
const block = /<a\b[^>]*href=["'](?:\/babble-expert\.html|https:\/\/youtu\.be\/IBgTrBk35uI)["'][^>]*>[\s\S]*?<\/a>\s*(?:<a\b[^>]*href=["']https:\/\/youtu\.be\/6ZK0IiQIkk4["'][^>]*>[\s\S]*?<\/a>\s*)?<h3\b[^>]*>Download Babble Expert<\/h3>\s*<a\b[^>]*href=["']https:\/\/github\.com\/licketySplitAUS\/BabbleExpert\/releases\/latest\/download\/BabbleExpert-Windows-Setup\.exe["'][^>]*>[\s\S]*?<\/a>\s*<a\b[^>]*href=["']https:\/\/github\.com\/licketySplitAUS\/BabbleExpert\/releases\/latest\/download\/BabbleExpert-macOS\.dmg["'][^>]*>[\s\S]*?<\/a>/g;

export function withExpertButton(html) {
  const updated = html.replace(block, expertButton);
  if (!updated.includes('class="babble-expert-button"') || updated.includes(stylesheet)) return updated;
  return updated.replace('</head>', `<link rel="stylesheet" href="${stylesheet}" />\n</head>`);
}
