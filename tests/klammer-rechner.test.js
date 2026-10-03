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

test('dreistellige Zahlen in Aufgaben enden auf 0', () => {
  const randomFor = (value, min, max) => (value - min + 0.5) / (max - min + 1);
  const assertPair = (pair) => {
    const dividend = Number(pair[0].text.match(/^\d+/)[0]);
    if (dividend >= 100 && dividend <= 999) {
      assert.equal(dividend % 10, 0, `${pair[0].text}: dreistellige Zahl muss auf 0 enden`);
    }
    for (const task of pair) {
      assert.ok(Number.isInteger(task.answer), `${task.text} sollte ganzzahlig sein`);
      assert.ok(task.answer >= 0, `${task.text} sollte nicht negativ sein`);
    }
  };

  // Alle möglichen Werte für b, c und den Multiplikator im Additionszweig.
  for (let divisor = 2; divisor <= 9; divisor++) {
    for (let addend = 1; addend <= 9; addend++) {
      for (let multiplier = 1; multiplier <= 4; multiplier++) {
        const values = [0.1, randomFor(divisor, 2, 9), randomFor(addend, 1, 9), randomFor(multiplier, 1, 4)];
        let cursor = 0;
        assertPair(makeProblemPair(() => values[cursor++]));
      }
    }
  }

  // Alle möglichen Werte für d, c und den Zusatzmultiplikator im Subtraktionszweig.
  for (let divisor = 4; divisor <= 12; divisor++) {
    for (let subtrahend = 1; subtrahend < divisor; subtrahend++) {
      for (let extraMultiplier = 0; extraMultiplier <= 3; extraMultiplier++) {
        const values = [0.9, randomFor(divisor, 4, 12), randomFor(subtrahend, 1, divisor - 1), randomFor(extraMultiplier, 0, 3)];
        let cursor = 0;
        assertPair(makeProblemPair(() => values[cursor++]));
      }
    }
  }
});

console.log(`${count} Tests bestanden.`);
