const cables = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120];

const inputIds = [
    "voltage", "current", "length", "material", "line",
    "pv-wp", "season", "batt-cap", "load-w", "inv-loss"
];

function setVoltage(v) {
    document.getElementById("voltage").value = v;
    calc();
}

inputIds.forEach(id => {
    document.getElementById(id).addEventListener("input", calc);
});

function calc() {
    // 1. WERTE EINLESEN
    const V = parseFloat(document.getElementById("voltage").value);
    const I = parseFloat(document.getElementById("current").value);
    const L = parseFloat(document.getElementById("length").value) * 2;
    const rho = parseFloat(document.getElementById("material").value);
    const maxDropPercent = parseFloat(document.getElementById("line").value);

    // Displays aktualisieren
    document.getElementById("v-val").innerText = V;
    document.getElementById("c-val").innerText = I;
    document.getElementById("l-val").innerText = (L/2).toFixed(1);
    document.getElementById("mat-name").innerText = rho < 0.02 ? "Kupfer" : "Aluminium";

    // KABEL BERECHNUNG
    let perfect = cables.find(A => ((L * I * rho) / A) / V * 100 <= maxDropPercent);
    const rA = perfect || 120;
    const dV = (L * I * rho) / rA;
    const dVp = (dV / V) * 100;
    const fuse = Math.ceil((I * 1.25) / 5) * 5;

    const cableStatus = dVp <= maxDropPercent ? "status-good" : "status-crit";
    document.getElementById("out").innerHTML = `
        <div class="result ${cableStatus}">
            <small>Empfehlung:</small>
            <h2>${rA} mm²</h2>
            <p>Spannungsabfall: ${dVp.toFixed(2)}%</p>
            <p>Sicherung: <b>ca. ${fuse}A</b></p>
        </div>
    `;

    // 2. SOLAR ERTRAG
    const Wp = parseFloat(document.getElementById("pv-wp").value);
    const factor = parseFloat(document.getElementById("season").value);
    document.getElementById("wp-val").innerText = Wp;
    
    const yieldWh = Wp * factor;
    document.getElementById("pv-out").innerHTML = `
        <div class="result status-good">
            <small>Tagesertrag ca.:</small>
            <h2>${yieldWh.toFixed(0)} Wh</h2>
            <p>Lädt ca. ${(yieldWh/V).toFixed(0)} Ah pro Tag.</p>
        </div>
    `;

    // 3. AUTARKIE
    const Ah = parseFloat(document.getElementById("batt-cap").value);
    const W = parseFloat(document.getElementById("load-w").value);
    const inv = parseFloat(document.getElementById("inv-loss").value);
    
    document.getElementById("batt-val").innerText = Ah;
    document.getElementById("load-val").innerText = W;
    document.getElementById("inv-val").innerText = inv;

    const totalLoad = W + inv;
    const usableWh = Ah * V * 0.8; 
    const hours = totalLoad > 0 ? usableWh / totalLoad : 0;
    const days = (hours / 24).toFixed(1);

    const battStatus = hours > 24 ? "status-good" : (hours > 6 ? "status-ok" : "status-crit");
    document.getElementById("batt-out").innerHTML = `
        <div class="result ${battStatus}">
            <small>Laufzeit (80% DOD):</small>
            <h2>${hours.toFixed(1)} Std.</h2>
            <p>ca. ${days} Tage | Last: ${totalLoad}W</p>
        </div>
    `;
}

// Erster Aufruf
calc();
