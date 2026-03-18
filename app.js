let db = JSON.parse(localStorage.getItem('itgg_db')) || [];
let activeId = null;

function save() {
    localStorage.setItem('itgg_db', JSON.stringify(db));
}

function renderArchive() {
    const list = document.getElementById('archiveList');
    list.innerHTML = "";

    db.forEach(inv => {
        list.innerHTML += `
        <tr onclick="viewInvoice('${inv.id}')">
            <td>${inv.id}</td>
            <td>${inv.klant}</td>
        </tr>`;
    });
}

function createNew() {
    const klant = document.getElementById('newKlant').value;

    const inv = {
        id: "INV-" + Date.now(),
        klant: klant,
        rows: [{desc: "Dienst", price: 0}]
    };

    db.unshift(inv);
    save();
    renderArchive();
    viewInvoice(inv.id);
}

function viewInvoice(id) {
    const inv = db.find(i => i.id === id);
    activeId = id;

    let rowsHTML = "";
    inv.rows.forEach((r, i) => {
        rowsHTML += `
        <div class="row">
            <input value="${r.desc}" onchange="updateRow(${i}, 'desc', this.value)">
            <input value="${r.price}" type="number" onchange="updateRow(${i}, 'price', this.value)">
        </div>`;
    });

    document.getElementById('invoicePrint').innerHTML = `
        <h1>FACTUUR</h1>
        <p>${inv.id}</p>
        <p>${inv.klant}</p>

        ${rowsHTML}

        <h3>Totaal: € <span id="total">0</span></h3>
    `;

    calcTotals();
}

function updateRow(i, field, value) {
    const inv = db.find(i2 => i2.id === activeId);
    inv.rows[i][field] = field === "price" ? parseFloat(value) : value;
    save();
    calcTotals();
}

function addRow() {
    const inv = db.find(i => i.id === activeId);
    inv.rows.push({desc: "Nieuwe dienst", price: 0});
    save();
    viewInvoice(activeId);
}

function calcTotals() {
    const inv = db.find(i => i.id === activeId);
    let total = 0;

    inv.rows.forEach(r => total += r.price || 0);

    document.getElementById('total').innerText = total.toFixed(2);
}

function downloadPDF() {
    const el = document.getElementById('invoicePrint');
    html2pdf().from(el).save();
}

function resetSystem() {
    if(confirm("Reset alles?")) {
        localStorage.clear();
        location.reload();
    }
}

window.onload = renderArchive;
