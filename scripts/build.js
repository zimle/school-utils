import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';

const output = new URL('../dist/', import.meta.url);
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
const [template, source] = await Promise.all([
  readFile(new URL('../site/klammer-rechner.html', import.meta.url), 'utf8'),
  readFile(new URL('../src/klammer-rechner.js', import.meta.url), 'utf8')
]);
const inlineScript = `<script>\n${source.replace(/^export /gm, '')}\n</script>`;
const page = template.replace('<!-- APP_SCRIPT -->', inlineScript);
for (const filename of ['index.html', 'klammer-rechner.html']) {
  await writeFile(new URL(filename, output), page);
}
console.log('Built dist/');
