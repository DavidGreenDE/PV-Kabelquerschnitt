const rho = 0.0178;
const cables = [6,10,16,25,35,50,70];

const voltage = document.getElementById("voltage");
const current = document.getElementById("current");
const length  = document.getElementById("length");
const line    = document.getElementById("line");
const out     = document.getElementById("out");

function num(el) {
  return parseFloat(el.value.replace(",", "."));
}

function setVoltage(v) {
  voltage.value = v;
  calc();
}

[voltage, current, length, line].forEach(e =>
  e.addEventListener("input", calc)
);

function calc() {
  const V = num(voltage);
  const I = num(current);
  const L = num(length) * 2;
  const maxDrop = parseFloat(line.value);

  if ([V,I,L].some(isNaN)) {
    out.innerHTML = "";
    return;
  }

  let best = null;
  let perfect = null;

  for (let A of cables) {
    const dV = (L * I * rho) / A;
    const dVp = dV / V * 100;

    if (!perfect && dVp <= maxDrop) {
      perfect = {A, dV, dVp};
    }
    best = {A, dV, dVp};
  }

  const r = perfect || best;
  const loss = r.dV * I;

  let hint = "";
  if (!perfect) {
    hint = `<p class="warn">
      ⚠ Zielwert (${maxDrop} %) überschritten.<br>
      Kürzere Leitung oder höhere Spannung empfohlen.
    </p>`;
  }

  // Spannungshinweis
  const alt = [24,48].find(v => v > V);
  if (alt) {
    const test = cables.find(A =>
      ((L * I * rho) / A) / alt * 100 <= maxDrop
    );
    if (test) {
      hint += `<p class="ok">
        ℹ Mit ${alt} V wären ${test} mm² ausreichend.
      </p>`;
    }
  }

  out.innerHTML = `
    <div class="result">
      <h3>Empfohlen: ${r.A} mm²</h3>
      <p>Spannungsabfall: ${r.dVp.toFixed(2)} %</p>
      <p>Verlustleistung: ${loss.toFixed(1)} W</p>
      ${hint}
    </div>
  `;
}
