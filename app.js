const cables = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120];

const inputs = [
    "voltage", "current", "length", "material", 
    "pv-wp", "season", "batt-cap", "load-w", "inv-loss"
];

function setVoltage(v) {
    document.getElementById("voltage").value = v;
    calc();
}

inputs.forEach(id => document.getElementById(id).addEventListener("input", calc));

function calc() {
    // 1. KABEL & SICHERUNG
    const V = parseFloat(document.getElementById("voltage").value) || 12;
    const I = parseFloat(document.getElementById("current").value);
    const L = parseFloat(document.getElementById("length").value) * 2;
    const rho = parseFloat(document.getElementById("material").value);
    
    document.getElementById("c-val").innerText = I;
    document.getElementById("l-val").innerText = (L/2).toFixed(1);

    let bestA = cables.find(A => ((L * I * rho) / A) / V * 100 <= 2) || 120;
    const dVp = ((L * I * rho) / bestA) / V * 100;
    const fuse = Math.ceil((I * 1.25) / 5) * 5;

    const cableStatus = dVp < 1 ? "status-good" : (dVp < 2 ? "status-ok" : "status-crit");
    document.getElementById("out").innerHTML = `
        <div class="result ${cableStatus}">
            <small>Kabelquerschnitt:</small>
            <h2>${bestA} mm²</h2>
            <p>Verlust: ${dVp.toFixed(2)}% | Sicherung: ${fuse}A</p>
        </div>
    `;

    // 2. SOLAR ERTRAG
    const Wp = parseFloat(document.getElementById("pv-wp").value);
    const factor = parseFloat(document.getElementById("season").value);
    document.getElementById("wp-val").innerText = Wp;
    
    const yieldWh = Wp * factor;
    document.getElementById("pv-out").innerHTML = `
        <div class="result status-good">
            <small>Ertrag pro Tag (ca.):</small>
            <h2>${yieldWh.toFixed(0)} Wh</h2>
            <p>Das lädt ca. ${(yieldWh/V).toFixed(0)} Ah nach.</p>
        </div>
    `;

    // 3. BATTERIE & INVERTER
    const Ah = parseFloat(document.getElementById("batt-cap").value);
    const W = parseFloat(document.getElementById("load-w").value);
    const inv = parseFloat(document.getElementById("inv-loss").value);
    
    document.getElementById("batt-val").innerText = Ah;
    document.getElementById("load-val").innerText = W;
    document.getElementById("inv-val").innerText = inv;

    const totalLoad = W + inv;
    const usableWh = Ah * V * 0.8; // 80% Nutzbarkeit
    const hours = totalLoad > 0 ? usableWh / totalLoad : 0;

    const battStatus = hours > 24 ? "status-good" : (hours > 12 ? "status-ok" : "status-crit");
    document.getElementById("batt-out").innerHTML = `
        <div class="result ${battStatus}">
            <small>Laufzeit (80% Entladung):</small>
            <h2>${hours.toFixed(1)} Std.</h2>
            <p>Verbrauch inkl. Inverter: ${totalLoad}W</p>
        </div>
    `;
}

calc();
