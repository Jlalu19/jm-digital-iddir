const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'iddir_db.json');

app.use(express.json());

// ዳታቤዝ መቆጣጠሪያ
function readDB() {
    if (!fs.existsSync(DATA_FILE)) {
        const initialData = { iddirs: {}, members: [], payments: [], assets: [] };
        fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
    }
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function writeDB(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// 🌐 ዋናው የተሟላ ገጽ (HTML FRONTEND INTEGRATED)
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="am">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JM የዲጂታል እድር ማኔጅመንት</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root { --bg-main: #0b0f19; --bg-card: #141b2d; --accent: #f59e0b; --success: #10b981; }
        body { background-color: var(--bg-main); color: #fff; font-family: sans-serif; }
        .card { background-color: var(--bg-card); border: 1px solid #1f293d; border-radius: 16px; margin-bottom: 20px; }
        .form-control, .form-select { background-color: #1f293d; border: 1px solid #334155; color: white; border-radius: 8px; }
        .form-control:focus, .form-select:focus { background-color: #1f293d; color: white; border-color: var(--accent); }
        .btn-premium { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #000; font-weight: bold; border: none; }
        .btn-success-custom { background: linear-gradient(135deg, #10b981 0%, #059669 100%); border: none; color: white; }
        .culture-section { background: #1e1b4b; border-left: 5px solid var(--accent); padding: 20px; border-radius: 12px; }
        .table { color: white; }
        .table th { background-color: #1f293d; color: #f59e0b; }
    </style>
</head>
<body>
    <nav class="navbar navbar-dark bg-dark py-3">
        <div class="container">
            <span class="navbar-brand fw-bold text-warning">🏛️ JM ዲጂታል እድር ሲስተም</span>
            <div id="auth-status" class="text-light fw-bold"></div>
        </div>
    </nav>

    <div class="container my-5">
        <div class="culture-section mb-5">
            <h4 class="text-warning fw-bold"><i class="fa-solid fa-book-open"></i> የእድር ታሪካዊ አመጣጥ እና የጉራጌ ባህል እሴት</h4>
            <p class="mt-2 text-light" style="line-height: 1.8;">
                እድር በኢትዮጵያ ማህበረሰብ ውስጥ ለዘመናት የዘለቀ፣ በችግርም ሆነ በደስታ ጊዜ መረዳጃ ጠንካራ ማህበራዊ ተቋም ነው። ይህ ተቋም በተለይም ከጉራጌ ማህበረሰብ ባህላዊ እሴቶች እና አስተዳደር ስርዓት ጋር ጥልቅ ቁርኝት አለው። በጉራጌ ታሪክ ውስጥ የሚታወቀው የ <strong>የጆቃ ቂጫ (Yejoka Qicha)</strong> የዲሞክራሲያዊ የፍትህ እና የጋራ ውሳኔ መርሆዎች ማህበረሰቡ በሰላም፣ በፍትህ እና በአንድነት እንዲኖር መሰረት የጣለ የህግ ስብስብ ነው። የ JM ዲጂታል እድር ይህንን የቆየ የጋራ መደጋገፍ እና የአንድነት ባህል ከዘመናዊው የቴክኖሎጂ አሰራር ጋር በማዋሃድ፣ ለህዝባችን ፈጣን፣ ግልጽ እና አስተማማኝ አገልግሎት ለማበርከት የተፈጠረ የዘመኑ የዲጂታል ማህበረሰብ ቋት ነው!
            </p>
        </div>

        <div id="login-box" class="card p-4 mx-auto" style="max-width: 400px;">
            <h4 class="text-center fw-bold text-warning mb-3">ደህንነቱ የተጠበቀ መግቢያ</h4>
            <div class="mb-3">
                <label class="form-label text-secondary">የመግቢያ ስም</label>
                <input type="text" id="login-user" class="form-control" placeholder="superadmin, admin, ወይም አባል ስም">
            </div>
            <div class="mb-3">
                <label class="form-label text-secondary">ሚስጥር ቁጥር</label>
                <input type="password" id="login-pass" class="form-control" value="password123">
            </div>
            <button onclick="handleLogin()" class="btn btn-premium w-100 py-2">ግባ</button>
            <div class="mt-3 text-center text-muted small">ኪንግ ፍንጭ፡ በ 'superadmin' ገብተው እድር መፍጠር ይችላሉ!</div>
        </div>

        <div id="dashboard-box" style="display:none;">
            
            <div id="superadmin-section" style="display:none;" class="mb-5">
                <div class="card p-4">
                    <h5 class="text-warning fw-bold mb-4"><i class="fa-solid fa-folder-plus"></i> አዲስ እድር መመዝገቢያ እና መቆጣጠሪያ ሰሌዳ</h5>
                    <div class="row g-3">
                        <div class="col-md-3"><input type="text" id="id-name" class="form-control" placeholder="የእድር ስም (ለምሳሌ፡ የጉብሬ አንድነት እድር)"></div>
                        <div class="col-md-3"><input type="text" id="id-admin" class="form-control" placeholder="የአስተዳዳሪ ስም"></div>
                        <div class="col-md-3"><input type="text" id="id-phone" class="form-control" placeholder="የአድሚን ስልክ ቁጥር"></div>
                        <div class="col-md-3"><input type="password" id="id-pass" class="form-control" placeholder="የአድሚን ፓስወርድ"></div>
                    </div>
                    <button onclick="createIddir()" class="btn btn-premium mt-3 px-4">አዲስ እድር ፍጠር</button>
                </div>

                <div class="card p-4">
                    <h5 class="text-warning fw-bold mb-3"><i class="fa-solid fa-list"></i> በሲስተሙ ላይ የተፈጠሩ አጠቃላይ እድሮች ዝርዝር</h5>
                    <div class="table-responsive">
                        <table class="table table-bordered">
                            <thead>
                                <tr>
                                    <th>የእድር መለያ (ID)</th>
                                    <th>የእድር ስም</th>
                                    <th>ዋና አስተዳዳሪ</th>
                                    <th>ስልክ ቁጥር</th>
                                    <th>ወርሃዊ መዋጮ</th>
                                </tr>
                            </thead>
                            <tbody id="iddirs-list-table">
                                <tr><td colspan="5" class="text-muted text-center">እየተጫነ ነው...</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div id="admin-section" style="display:none;" class="mb-5">
                <div class="card p-4">
                    <h5 class="text-warning fw-bold mb-3"><i class="fa-solid fa-sliders"></i> የእድር ህጎች፣ የመዋጮ መጠን እና የባንክ አካውንት መጫኛ</h5>
                    <div class="row g-3 mb-3">
                        <div class="col-md-6">
                            <label class="form-label">የወርሃዊ መዋጮ የገንዘብ መጠን (በብር)</label>
                            <input type="number" id="adm-fee" class="form-control" placeholder="ለምሳሌ፡ 200">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">የመክፈያ ቀነ-ገደብ (Deadline)</label>
                            <input type="text" id="adm-deadline" class="form-control" placeholder="ለምሳሌ፡ ከየወሩ 1 - 5 ቀን">
                        </div>
                    </div>
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label">የኢትዮጵያ ንግድ ባንክ አካውንት</label>
                            <input type="text" id="adm-bank1" class="form-control" placeholder="CBE Account Number">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">የቴሌብር (telebirr) ቁጥር</label>
                            <input type="text" id="adm-bank2" class="form-control" placeholder="Telebirr Merchant / Phone">
                        </div>
                    </div>
                    <button onclick="saveAdminRules()" class="btn btn-success-custom mt-3 px-4">መረጃዎቹን በይፋ ስቅለህ አውጣ</button>
                </div>
            </div>

            <div id="member-section" style="display:none;">
                <div class="card p-4">
                    <h5 class="text-warning fw-bold mb-3"><i class="fa-solid fa-credit-card"></i> በባንክ መክፈያ እና የክፍያ ደረሰኝ/ትራንዛክሽን ማስገቢያ ፎርም</h5>
                    <div class="alert alert-warning text-dark fw-bold mb-4">
                        📌 የእድር አስተዳዳሪ የለጠፈው መረጃ፡ <br>
                        • ወርሃዊ መዋጮ፡ <span id="m-display-fee">የአድሚን መረጃ ይጠበቃል...</span> ብር <br>
                        • ቀነ-ገደብ፡ <span id="m-display-deadline">-</span> <br>
                        • ንግድ ባንክ አካውንት፡ <span id="m-display-bank">-</span> <br>
                        • ቴሌብር ቁጥር፡ <span id="m-display-tele">-</span>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">የከፈሉት የገንዘብ መጠን</label>
                        <input type="number" id="p-amount" class="form-control" placeholder="የብር መጠን ያስገቡ">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">የከፈሉበት የባንክ ስም</label>
                        <input type="text" id="p-bank" class="form-control" placeholder="ለምሳሌ፡ ንግድ ባንክ ወይም ቴሌብር">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">የትራንዛክሽን ቁጥር (Transaction ID / Txn ID)</label>
                        <input type="text" id="p-txn" class="form-control" placeholder="ለምሳሌ፡ FT24XXXXXXXX">
                    </div>
                    <button onclick="submitPayment()" class="btn btn-premium w-100 py-2">የክፍያ ፎርም ለቦርድ አስረክብ</button>
                </div>
            </div>

        </div>
    </div>

    <script>
        let currentUserRole = "";
        let selectedIddirId = "iddir_default";

        async function loadIddirs() {
            try {
                const res = await fetch('/api/get-db');
                const db = await res.json();
                const tbody = document.getElementById('iddirs-list-table');
                tbody.innerHTML = "";
                
                const iddirKeys = Object.keys(db.iddirs);
                if(iddirKeys.length === 0) {
                    tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">ምንም የተፈጠረ እድር የለም! እባክዎ ከላይ ይፍጠሩ።</td></tr>`;
                    return;
                }

                iddirKeys.forEach(key => {
                    const iddir = db.iddirs[key];
                    tbody.innerHTML += `
                        <tr>
                            <td class="text-info font-monospace">${key}</td>
                            <td class="fw-bold text-white">${iddir.name}</td>
                            <td>${iddir.admin_name}</td>
                            <td>${iddir.admin_phone}</td>
                            <td class="text-warning fw-bold">${iddir.monthly_fee || 0} ብር</td>
                        </tr>
                    `;
                    // አባላት የአድሚኑን መረጃ እንዲያዩ ለመጀመሪያው እድር እንመድበው
                    selectedIddirId = key;
                    document.getElementById('m-display-fee').innerText = iddir.monthly_fee || 0;
                    document.getElementById('m-display-deadline').innerText = iddir.deadline || "ያልተወሰነ";
                    document.getElementById('m-display-bank').innerText = (iddir.bank_accounts && iddir.bank_accounts[0]) || "ያልተለጠፈ";
                    document.getElementById('m-display-tele').innerText = (iddir.bank_accounts && iddir.bank_accounts[1]) || "ያልተለጠፈ";
                });
            } catch (e) { console.error("ዳታ መጫን አልተቻለም", e); }
        }

        function handleLogin() {
            const user = document.getElementById('login-user').value.trim().toLowerCase();
            if(!user) { alert("እባክዎ የመግቢያ ስም ያስገቡ!"); return; }

            document.getElementById('login-box').style.display = 'none';
            document.getElementById('dashboard-box').style.display = 'block';
            
            // ሁሉንም ክፍሎች መደበቅ
            document.getElementById('superadmin-section').style.display = 'none';
            document.getElementById('admin-section').style.display = 'none';
            document.getElementById('member-section').style.display = 'none';

            if(user === 'superadmin') {
                currentUserRole = "superadmin";
                document.getElementById('auth-status').innerHTML = `<span class="badge bg-danger"><i class="fa-solid fa-user-shield"></i> ሱፐር አድሚን</span>`;
                document.getElementById('superadmin-section').style.display = 'block';
                loadIddirs();
            } else if(user === 'admin') {
                currentUserRole = "admin";
                document.getElementById('auth-status').innerHTML = `<span class="badge bg-warning text-dark"><i class="fa-solid fa-user-gear"></i> የእድር አድሚን</span>`;
                document.getElementById('admin-section').style.display = 'block';
                loadIddirs();
            } else {
                currentUserRole = "member";
                document.getElementById('auth-status').innerHTML = `<span class="badge bg-success"><i class="fa-solid fa-user"></i> አባል፡ ${user}</span>`;
                document.getElementById('member-section').style.display = 'block';
                loadIddirs();
            }
        }

        async function createIddir() {
            const name = document.getElementById('id-name').value;
            const admin_name = document.getElementById('id-admin').value;
            const admin_phone = document.getElementById('id-phone').value;
            const admin_pass = document.getElementById('id-pass').value;

            if(!name || !admin_name || !admin_phone) { alert("እባክዎ ሁሉንም ሳጥኖች ይሙሉ!"); return; }

            const res = await fetch('/api/superadmin/create-iddir', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ name, admin_name, admin_phone, admin_pass })
            });
            const data = await res.json();
            if(data.success) { 
                alert("🎉 አዲስ እድር በተሳካ ሁኔታ ተፈጥሮ ወደ ዳታቤዝ ተጨምሯል!"); 
                // ሳጥኖቹን ባዶ ማድረግ
                document.getElementById('id-name').value = "";
                document.getElementById('id-admin').value = "";
                document.getElementById('id-phone').value = "";
                document.getElementById('id-pass').value = "";
                loadIddirs(); 
            }
        }

        async function saveAdminRules() {
            const fee = document.getElementById('adm-fee').value;
            const deadline = document.getElementById('adm-deadline').value;
            const b1 = document.getElementById('adm-bank1').value;
            const b2 = document.getElementById('adm-bank2').value;

            const res = await fetch('/api/admin/setup-rules', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ iddir_id: selectedIddirId, monthly_fee: fee, deadline, bank_accounts: [b1, b2] })
            });
            const data = await res.json();
            if(data.success) {
                alert("🏛️ የእድር ህጎች እና የባንክ አካውንቶች በይፋ ተለጥፈዋል!");
                loadIddirs();
            }
        }

        function submitPayment() {
            const amt = document.getElementById('p-amount').value;
            const bnk = document.getElementById('p-bank').value;
            const txn = document.getElementById('p-txn').value;
            if(!amt || !bnk || !txn) { alert("እባክዎ ሁሉንም የክፍያ መረጃዎች ይሙሉ!"); return; }
            alert("✅ የክፍያ መረጃዎ በትክክል ተልኳል። አስተዳዳሪው ደረሰኝዎን አረጋግጦ ይመዘግባል!");
        }
    </script>
</body>
</html>
    `);
});

// APIs
app.get('/api/get-db', (req, res) => {
    res.json(readDB());
});

app.post('/api/superadmin/create-iddir', (req, res) => {
    const { name, admin_name, admin_phone, admin_pass } = req.body;
    let db = readDB();
    const iddir_id = "iddir_" + Date.now();
    db.iddirs[iddir_id] = { name, admin_name, admin_phone, admin_pass, monthly_fee: 0, deadline: "ያልተወሰነ", bank_accounts: [] };
    writeDB(db);
    res.json({ success: true, iddir_id });
});

app.post('/api/admin/setup-rules', (req, res) => {
    const { iddir_id, monthly_fee, deadline, bank_accounts } = req.body;
    let db = readDB();
    if (db.iddirs[iddir_id] || iddir_id === 'iddir_default') {
        if(!db.iddirs[iddir_id]) {
            db.iddirs[iddir_id] = { name: "አጠቃላይ እድር", admin_name: "አድሚን", admin_phone: "09", admin_pass: "123" };
        }
        db.iddirs[iddir_id].monthly_fee = monthly_fee;
        db.iddirs[iddir_id].deadline = deadline;
        db.iddirs[iddir_id].bank_accounts = bank_accounts;
        writeDB(db);
        res.json({ success: true });
    } else { res.status(404).json({ error: "Not found" }); }
});

app.listen(PORT, () => { console.log(`Server running on port ${PORT}`); });
