import assert from 'node:assert/strict';
import { primeFactors, lcmFromPrimeFactors, makeProblemPair } from '../src/klammer-rechner.js';

let count = 0;
function test(name, check) {
  check();
  count++;
  console.log(`✓ ${name}`);
}

test('zerlegt Zahlen in Primfaktoren', () => {
  assert.deepEqual([...primeFactors(36)], [[2, 2], [3, 2]]);
});

test('bildet das kgV aus den Primfaktorpotenzen', () => {
  assert.equal(lcmFromPrimeFactors(12, 18), 36);
});

test('Subtraktionsaufgaben haben ganzzahlige, nichtnegative Ergebnisse', () => {
  // Steuert den Zufall in den Subtraktionszweig und variiert d, c und Faktor.
  for (let i = 0; i < 1000; i++) {
    const values = [0.9, (i % 9) / 9, ((i * 7) % 11) / 11, ((i * 3) % 4) / 4];
    let cursor = 0;
    const pair = makeProblemPair(() => values[cursor++ % values.length]);
    assert.equal(pair.length, 2);
    for (const task of pair) {
      assert.ok(Number.isInteger(task.answer), `${task.text} sollte ganzzahlig sein`);
      assert.ok(task.answer >= 0, `${task.text} sollte nicht negativ sein`);
    }
  }
});

test('Additionsaufgaben haben ganzzahlige Ergebnisse', () => {
  const values = [0.1, 0.5, 0.2, 0];
  let cursor = 0;
  const pair = makeProblemPair(() => values[cursor++ % values.length]);
  assert.ok(pair.every(({ answer }) => Number.isInteger(answer) && answer >= 0));
});

console.log(`${count} Tests bestanden.`);
