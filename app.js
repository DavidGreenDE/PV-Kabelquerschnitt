const rho = 0.0178;
const cables = [6, 10, 16, 25, 35, 50, 70, 95, 120]; // Um größere Kabel ergänzt

const voltage = document.getElementById("voltage");
const current = document.getElementById("current");
const length  = document.getElementById("length");
const line    = document.getElementById("line");
const out     = document.getElementById("out");

// Displays
const vVal = document.getElementById("v-val");
const cVal = document.getElementById("c-val");
const lVal = document.getElementById("l-val");

function setVoltage(v) {
  voltage.value = v;
  calc();
}

[voltage, current, length, line].forEach(e =>
  e.addEventListener("input", calc)
);

function calc() {
  // Update der Anzeige-Texte
  vVal.innerText = voltage.value;
  cVal.innerText = current.value;
  lVal.innerText = length.value;

  const V = parseFloat(voltage.value);
  const I = parseFloat(current.value);
  const L = parseFloat(length.value) * 2;
  const maxDrop = parseFloat(line.value);

  let best = null;
  let perfect = null;

  for (let A of cables) {
    const dV = (L * I * rho) / A;
    const dVp = (dV / V) * 100;

    if (!perfect && dVp <= maxDrop) {
      perfect = {A, dV, dVp};
    }
    best = {A, dV, dVp};
  }

  const r = perfect || best;
  const loss = r.dV * I;

  let hint = "";
  if (!perfect) {
    hint = `<p class="warn">⚠ Limit von ${maxDrop}% überschritten!</p>`;
  }

  out.innerHTML = `
    <div class="result">
      <small>Empfohlener Querschnitt:</small>
      <h2 style="margin:0; color:#2ecc71;">${r.A} mm²</h2>
      <hr style="border:0; border-top:1px solid #333; margin:10px 0;">
      <p>Verlust: <b>${r.dVp.toFixed(2)} %</b> (${r.dV.toFixed(2)} V)</p>
      <p>Verlustleistung: <b>${loss.toFixed(1)} W</b></p>
      ${hint}
    </div>
  `;
}

// Initialer Aufruf
calc();