export const siteIcons = '<link rel="icon" href="https://selfserve.r46.me/favicon.ico" type="image/x-icon"><link rel="icon" href="https://selfserve.r46.me/babble-expert-favicon.png" type="image/png" sizes="32x32"><link rel="apple-touch-icon" href="https://selfserve.r46.me/apple-touch-icon.png" sizes="180x180">';

export const infoIcons = '<link rel="icon" href="https://r46.me/lickety-info-favicon.png" type="image/png" sizes="32x32"><link rel="apple-touch-icon" href="https://r46.me/lickety-info-apple-touch-icon.png" sizes="180x180">';

// Also covers the compact word-list documents that use an implicit HTML head.
export function withSiteIcons(html, pagePath = '') {
  const icons = /(^|\/)lickety-info\.html$/i.test(pagePath) ? infoIcons : siteIcons;
  let replaced = false;
  const updated = html.replace(/<link\b(?=[^>]*\brel\s*=\s*["'](?:icon|shortcut\s+icon|apple-touch-icon)["'])[^>]*>/gi, () => {
    if (replaced) return '';
    replaced = true;
    return icons;
  });
  if (replaced) return updated;
  if (/<\/head\s*>/i.test(updated)) return updated.replace(/<\/head\s*>/i, match => icons + '\n' + match);
  if (/<head\b[^>]*>/i.test(updated)) return updated.replace(/<head\b[^>]*>/i, match => match + icons);
  if (/<!doctype[^>]*>/i.test(updated)) return updated.replace(/<!doctype[^>]*>/i, match => match + icons);
  return icons + updated;
}
