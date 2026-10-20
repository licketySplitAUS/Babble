export const sourceOrigin = 'https://selfserveclues.netlify.app';

export function routingRules(enabled) {
  const rules = [];
  if (enabled) {
    for (const path of ['/babbleclues', '/babbleclues.html']) rules.push(`${path} ${sourceOrigin}/history-preview.html 200!`);
    for (const path of ['/babbleprintableclues', '/babbleprintableclues.html']) rules.push(`${path} ${sourceOrigin}/history-preview.html?print=1 200!`);
  }
  // Dedicated preview route allows testing the original domain before launch.
  rules.push(`/new-babbleclues ${sourceOrigin}/history-preview.html 200!`);
  rules.push(`/selfserve-clues ${sourceOrigin}/index.html 200!`);
  for (const file of ['history-preview.html', 'history-admin.html']) rules.push(`/${file} ${sourceOrigin}/${file} 200!`);
  for (const directory of ['assets', 'history-api', 'history-preview-data', 'api']) rules.push(`/${directory}/* ${sourceOrigin}/${directory}/:splat 200!`);
  for (const file of ['BabbleWordList.csv', 'favicon.svg', 'file.svg', 'globe.svg', 'window.svg']) rules.push(`/${file} ${sourceOrigin}/${file} 200!`);
  return rules.join('\n') + '\n';
}
