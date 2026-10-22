export const expertButton = '<div class="expert-button-wrap"><a class="babble-expert-button" href="https://r46.me/babble-expert.html?from=rainbow-button" target="_blank" rel="noopener noreferrer"><span>Babble Expert</span></a></div>';
export const infoLink = '<div class="lickety-info-link"><a href="https://r46.me/lickety-info.html" target="_blank" rel="noopener noreferrer">Lickety Info</a></div>';
const stylesheet = 'https://selfserve.r46.me/expert-guide/babble-expert-button.css';
// The daily legacy generator can reintroduce its old links. Normalize that
// specific sidebar block at build time so the button survives puzzle updates.
const block = /<a\b[^>]*href=["'](?:\/babble-expert\.html|https:\/\/youtu\.be\/IBgTrBk35uI)["'][^>]*>[\s\S]*?<\/a>\s*(?:<a\b[^>]*href=["']https:\/\/youtu\.be\/6ZK0IiQIkk4["'][^>]*>[\s\S]*?<\/a>\s*)?<h3\b[^>]*>Download Babble Expert<\/h3>\s*<a\b[^>]*href=["']https:\/\/github\.com\/licketySplitAUS\/BabbleExpert\/releases\/latest\/download\/BabbleExpert-Windows-Setup\.exe["'][^>]*>[\s\S]*?<\/a>\s*<a\b[^>]*href=["']https:\/\/github\.com\/licketySplitAUS\/BabbleExpert\/releases\/latest\/download\/BabbleExpert-macOS\.dmg["'][^>]*>[\s\S]*?<\/a>/g;

export function withExpertButton(html) {
  let updated = html.replace(block, expertButton);
  updated = updated.replace(/(<a\b[^>]*class=["']babble-expert-button["'][^>]*href=["'])[^"']+(["'])/g,
    (_, prefix, quote) => prefix + 'https://r46.me/babble-expert.html?from=rainbow-button' + quote);
  // Put the Info link last in the legacy right column, outside its old center tag.
  if (!updated.includes('class="lickety-info-link"')) {
    updated = updated.replace(/(<div id=["']g_sidebar["']>[\s\S]*?<\/center>)(\s*<\/div>)/, `$1
${infoLink}$2`);
  }
  if ((!updated.includes('class="babble-expert-button"') && !updated.includes('class="lickety-info-link"')) || updated.includes(stylesheet)) return updated;
  return updated.replace('</head>', `<link rel="stylesheet" href="${stylesheet}" />\n</head>`);
}
