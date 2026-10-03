// Rechenlogik ohne DOM-Abhängigkeiten, damit sie auch in Node getestet werden kann.
export function primeFactors(number) {
  const factors = new Map();
  for (let divisor = 2; divisor * divisor <= number; divisor++) {
    while (number % divisor === 0) {
      factors.set(divisor, (factors.get(divisor) || 0) + 1);
      number /= divisor;
    }
  }
  if (number > 1) factors.set(number, (factors.get(number) || 0) + 1);
  return factors;
}

export function lcmFromPrimeFactors(a, b) {
  const factorsA = primeFactors(a);
  const factorsB = primeFactors(b);
  let product = 1;
  for (const prime of new Set([...factorsA.keys(), ...factorsB.keys()])) {
    product *= prime ** Math.max(factorsA.get(prime) || 0, factorsB.get(prime) || 0);
  }
  return product;
}

function randomInt(min, max, random) {
  return Math.floor(random() * (max - min + 1)) + min;
}

// random ist injizierbar, damit alle Erzeugungszweige reproduzierbar testbar sind.
export function makeProblemPair(random = Math.random) {
  if (random() < 0.5) {
    const divisor = randomInt(2, 9, random);
    const addend = randomInt(1, 9, random);
    const dividend = lcmFromPrimeFactors(divisor, divisor + addend) * randomInt(1, 4, random);
    return [
      { text: `${dividend} : ${divisor} + ${addend}`, answer: dividend / divisor + addend },
      { text: `${dividend} : (${divisor} + ${addend})`, answer: dividend / (divisor + addend) }
    ];
  }

  const divisor = randomInt(4, 12, random);
  const subtrahend = randomInt(1, divisor - 1, random);
  const parenthesizedDivisor = divisor - subtrahend;
  const commonMultiple = lcmFromPrimeFactors(divisor, parenthesizedDivisor);
  // a/d - c >= 0: the multiplier is at least ceil(c / (kgV/d)).
  const minMultiplier = Math.ceil(subtrahend / (commonMultiple / divisor));
  const dividend = commonMultiple * (minMultiplier + randomInt(0, 3, random));
  return [
    { text: `${dividend} : ${divisor} − ${subtrahend}`, answer: dividend / divisor - subtrahend },
    { text: `${dividend} : (${divisor} − ${subtrahend})`, answer: dividend / parenthesizedDivisor }
  ];
}

function startPractice() {
  const list = document.querySelector('#aufgaben');
  let pairNumber = 0;

  function appendPair() {
    pairNumber++;
    const pair = makeProblemPair();
    const card = document.createElement('article');
    card.className = 'block';
    const heading = document.createElement('h2');
    heading.textContent = `Aufgabenpaar ${pairNumber}`;
    card.append(heading);
    let correctCount = 0;

    for (const task of pair) {
      const row = document.createElement('div');
      row.className = 'zeile';
      const expression = document.createElement('label');
      expression.className = 'rechnung';
      expression.textContent = `${task.text} =`;
      const input = document.createElement('input');
      input.type = 'number';
      input.step = '1';
      input.inputMode = 'numeric';
      input.setAttribute('aria-label', `Ergebnis von ${task.text}`);
      input.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowUp' || event.key === 'ArrowDown') event.preventDefault();
      });
      const mark = document.createElement('span');
      mark.className = 'zeichen';
      mark.setAttribute('aria-live', 'polite');
      row.append(expression, input, mark);
      card.append(row);

      input.addEventListener('input', () => {
        const empty = input.value.trim() === '';
        const correct = !empty && Number(input.value) === task.answer;
        mark.textContent = empty ? '' : correct ? '✓' : '✗';
        mark.className = `zeichen ${correct ? 'richtig' : 'falsch'}`;
        mark.setAttribute('aria-label', empty ? '' : correct ? 'Richtig' : 'Noch nicht richtig');

        if (correct && input.dataset.correct !== 'yes') {
          input.dataset.correct = 'yes';
          correctCount++;
        } else if (!correct && input.dataset.correct === 'yes') {
          delete input.dataset.correct;
          correctCount--;
        }
        if (correctCount === 2 && !card.dataset.complete) {
          card.dataset.complete = 'yes';
          appendPair();
        } else if (correctCount < 2 && card.dataset.complete) {
          delete card.dataset.complete;
          card.nextElementSibling?.remove();
        }
      });
    }
    list.append(card);
  }

  appendPair();
}

if (typeof document !== 'undefined') startPractice();
