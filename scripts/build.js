import { cp, mkdir, rm } from 'node:fs/promises';

const output = new URL('../dist/', import.meta.url);
await rm(output, { recursive: true, force: true });
await mkdir(new URL('assets/', output), { recursive: true });
await cp(new URL('../site/klammer-rechner.html', import.meta.url), new URL('klammer-rechner.html', output));
await cp(new URL('../site/klammer-rechner.html', import.meta.url), new URL('index.html', output));
await cp(new URL('../src/klammer-rechner.js', import.meta.url), new URL('assets/klammer-rechner.js', output));
console.log('Built dist/');
