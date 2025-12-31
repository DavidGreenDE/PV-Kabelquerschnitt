const cables = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95];

// Elemente Kabel
const voltage = document.getElementById("voltage");
const current = document.getElementById("current");
const length  = document.getElementById("length");
const line    = document.getElementById("line");
const material = document.getElementById("material");
const out     = document.getElementById("out");

// Elemente Batterie
const battCap = document.getElementById("batt-cap");
const loadW = document.getElementById("load-w");
const battOut = document.getElementById("batt-out");

function setVoltage(v) {
    voltage.value = v;
    calc();
}

[voltage, current, length, line, material, battCap, loadW].forEach(e =>
    e.addEventListener("input", calc)
);

function calc() {
    // 1. KABEL BERECHNUNG
    const V = parseFloat(voltage.value);
    const I = parseFloat(current.value);
    const L = parseFloat(length.value) * 2;
    const maxDropPercent = parseFloat(line.value);
    const rho = parseFloat(material.value);

    document.getElementById("v-val").innerText = V;
    document.getElementById("c-val").innerText = I;
    document.getElementById("l-val").innerText = parseFloat(length.value).toFixed(1);

    let perfect = cables.find(A => ((L * I * rho) / A) / V * 100 <= maxDropPercent);
    const rA = perfect || cables[cables.length - 1];
    const dV = (L * I * rho) / rA;
    const dVp = (dV / V) * 100;
    
    // Sicherungsempfehlung (I * 1.25 Sicherheitsfaktor)
    const fuse = Math.ceil((I * 1.25) / 5) * 5;

    out.innerHTML = `
        <div class="result">
            <small>Empfohlener Querschnitt:</small>
            <h2 style="color:#2ecc71; margin:5px 0;">${rA} mm²</h2>
            <p>Verlust: ${dVp.toFixed(2)}% (${dV.toFixed(2)}V)</p>
            <p>Sicherung: <b>ca. ${fuse}A</b></p>
        </div>
    `;

    // 2. BATTERIE BERECHNUNG
    const Ah = parseFloat(battCap.value);
    const W = parseFloat(loadW.value);
    document.getElementById("batt-val").innerText = Ah;
    document.getElementById("load-val").innerText = W;

    const totalWh = Ah * V * 0.8; // Rechnet mit 80% Nutzbarkeit (Lithium/GEL Mix)
    const hours = W > 0 ? totalWh / W : 0;
    const days = (hours / 24).toFixed(1);

    battOut.innerHTML = `
        <div class="result">
            <p>Laufzeit (bei 80% Entladung):</p>
            <h2 style="color:#3498db; margin:5px 0;">${hours.toFixed(1)} Std.</h2>
            <small>entspricht ca. ${days} Tagen</small>
        </div>
    `;
}

calc();
