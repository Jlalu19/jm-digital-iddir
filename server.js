const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let tempDB = {
    iddirs: {},
    members: [],
    payments: []
};

app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="am">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JM የዲጂታል እድር ማኔጅመንት</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body { background-color: #0b0f19; color: #fff; font-family: sans-serif; padding-top: 20px; }
        .card { background-color: #141b2d; border: 1px solid #1f293d; border-radius: 16px; margin-bottom: 20px; padding: 20px; }
        .form-control { background-color: #1f293d; border: 1px solid #334155; color: white; }
        .form-control:focus { background-color: #1f293d; color: white; border-color: #f59e0b; }
        .btn-premium { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #000; font-weight: bold; border: none; }
        .btn-success-custom { background: linear-gradient(135deg, #10b981 0%, #059669 100%); border: none; color: white; }
        .culture-section { background: #1e1b4b; border-left: 5px solid #f59e0b; padding: 20px; border-radius: 12px; margin-bottom: 30px; }
        .table { color: white; }
        .table th { background-color: #1f293d; color: #f59e0b; }
    </style>
</head>
<body>
    <div class="container">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="text-warning fw-bold">🏛️ JM ዲጂታል እድር ሲስተም</h2>
            <div id="auth-status" class="fw-bold"></div>
        </div>

        <div class="culture-section">
            <h4 class="text-warning fw-bold"> የእድር ታሪካዊ አመጣጥ እና የጉራጌ ባህል እሴት</h4>
            <p class="mt-2 text-light" style="line-height: 1.8;">
                እድር በኢትዮጵያ ማህበረሰብ ውስጥ ለዘመናት የዘለቀ፣ በችግርም ሆነ በደስታ ጊዜ መረዳጃ ጠንካራ ማህበራዊ ተቋም ነው። ይህ ተቋም በተለይም ከጉራጌ ማህበረሰብ ባህላዊ እሴቶች እና አስተዳደር ስርዓት ጋር ጥልቅ ቁርኝት አለው። በጉራጌ ታሪክ ውስጥ የሚታወቀው የ <strong>የጆቃ ቂጫ (Yejoka Qicha)</strong> የዲሞክራሲያዊ የፍትህ እና የጋራ ውሳኔ መርሆዎች ማህበረሰቡ በሰላም፣ በፍትህ እና በአንድነት እንዲኖር መሰረት የጣለ የህግ ስብስብ ነው። የ JM ዲጂታል እድር ይህንን የቆየ የጋራ መደጋገፍ እና የአንድነት ባህል ከዘመናዊው የቴክኖሎጂ አሰራር ጋር በማዋሃድ፣ ለህዝባችን ፈጣን፣ ግልጽ እና አስተማማኝ አገልግሎት ለማበርከት የተፈጠረ የዘመኑ የዲጂታል ማህበረሰብ ቋት ነው!
            </p>
        </div>

        <div id="login-box" class="card mx-auto" style="max-width: 400px;">
            <h4 class="text-center fw-bold text-warning mb-3">ደህንነቱ የተጠበቀ መግቢያ</h4>
            <div class="mb-3">
                <label class="form-label">የመግቢያ ስም</label>
                <input type="text" id="login-user" class="form-control" placeholder="superadmin, admin, ወይም አባል ስም">
            </div>
            <button onclick="handleLogin()" class="btn btn-premium w-100 py-2">ግባ</button>
            <div class="mt-3 text-center text-muted small">ኪንግ ፍንጭ፡ በ 'superadmin' ገብተው እድር መፍጠር ይችላሉ!</div>
        </div>

        <div id="dashboard-box" style="display:none;">
            <div id="superadmin-section" style="display:none;">
                <div class="card">
                    <h5 class="text-warning fw-bold mb-3"> አዲስ እድር መመዝገቢያ ሰሌዳ</h5>
                    <div class="row g-3">
                        <div class="col-md-4"><input type="text" id="id-name" class="form-control" placeholder="የእድር ስም (ለምሳሌ፡ የጉብሬ አንድነት)"></div>
                        <div class="col-md-4"><input type="text" id="id-admin" class="form-control" placeholder="የአስተዳዳሪ ስም"></div>
                        <div class="col-md-4"><input type="text" id="id-phone" class="form-control" placeholder="የአድሚን ስልክ ቁጥር"></div>
                    </div>
                    <button onclick="createIddir()" class="btn btn-premium mt-3 px-4">አዲስ እድር ፍጠር</button>
                </div>

                <div class="card">
                    <h5 class="text-warning fw-bold mb-3"> በሲስተሙ ላይ የተፈጠሩ እድሮች ዝርዝር</h5>
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
                        <tbody id="iddirs-list-table"></tbody>
                    </table>
                </div>
            </div>

            <div id="admin-section" style="display:none;">
                <div class="card">
                    <h5 class="text-warning fw-bold mb-3"> የእድር ህጎች እና የባንክ አካውንት መጫኛ</h5>
                    <div class="row g-3 mb-3">
                        <div class="col-md-6"><input type="number" id="adm-fee" class="form-control" placeholder="የወርሃዊ መዋጮ መጠን በብር"></div>
                        <div class="col-md-6"><input type="text" id="adm-deadline" class="form-control" placeholder="የመክፈያ ቀነ-ገደብ"></div>
                    </div>
                    <div class="row g-3">
                        <div class="col-md-6"><input type="text" id="adm-bank1" class="form-control" placeholder="የንግድ ባንክ አካውንት"></div>
                        <div class="col-md-6"><input type="text" id="adm-bank2" class="form-control" placeholder="የቴሌብር ቁጥር"></div>
                    </div>
                    <button onclick="saveAdminRules()" class="btn btn-success-custom mt-3 px-4">መረጃዎቹን በይፋ ስቅለህ አውጣ</button>
                </div>
            </div>

            <div id="member-section" style="display:none;">
                <div class="card">
                    <h5 class="text-warning fw-bold mb-3"> በባንክ መክፈያ እና የክፍያ ደረሰኝ ማስገቢያ ፎርም</h5>
                    <div class="alert alert-warning text-dark fw-bold mb-3">
                        📌 የለጠፈው መረጃ፦ <br>
                        • መዋጮ፡ <span id="m-display-fee">0</span> ብር | • ቀነ-ገደብ፡ <span id="m-display-deadline">-</span> <br>
                        • ንግድ ባንክ፡ <span id="m-display-bank">-</span> | • ቴሌብር፡ <span id="m-display-tele">-</span>
                    </div>
                    <div class="mb-3"><input type="number" id="p-amount" class="form-control" placeholder="የብር መጠን ያስገቡ"></div>
                    <div class="mb-3"><input type="text" id="p-bank" class="form-control" placeholder="የባንክ ስም"></div>
                    <div class="mb-3"><input type="text" id="p-txn" class="form-control" placeholder="የትራንዛክሽን ቁጥር (Txn ID)"></div>
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
                    tbody.innerHTML = "<tr><td colspan='5' class='text-center text-muted'>ምንም የተፈጠረ እድር የለም!</td></tr>";
                    return;
                }
                iddirKeys.forEach(key => {
                    const iddir = db.iddirs[key];
                    tbody.innerHTML += `<tr><td>${key}</td><td class='fw-bold'>${iddir.name}</td><td>${iddir.admin_name}</td><td>${iddir.admin_phone}</td><td>${iddir.monthly_fee || 0} ብር</td></tr>`;
                    selectedIddirId = key;
                    document.getElementById('m-display-fee').innerText = iddir.monthly_fee || 0;
                    document.getElementById('m-display-deadline').innerText = iddir.deadline || "-";
                    document.getElementById('m-display-bank').innerText = (iddir.bank_accounts && iddir.bank_accounts[0]) || "-";
                    document.getElementById('m-display-tele').innerText = (iddir.bank_accounts && iddir.bank_accounts[1]) || "-";
                });
            } catch (e) { console.error(e); }
        }

        function handleLogin() {
            const user = document.getElementById('login-user').value.trim().toLowerCase();
            if(!user) return;
            document.getElementById('login-box').style.display = 'none';
            document.getElementById('dashboard-box').style.display = 'block';
            document.getElementById('superadmin-section').style.display = 'none';
            document.getElementById('admin-section').style.display = 'none';
            document.getElementById('member-section').style.display = 'none';

            if(user === 'superadmin') {
                document.getElementById('auth-status').innerHTML = "<span class='badge bg-danger'>ሱፐር አድሚን</span>";
                document.getElementById('superadmin-section').style.display = 'block';
            } else if(user === 'admin') {
                document.getElementById('auth-status').innerHTML = "<span class='badge bg-warning text-dark'>እድር አድሚን</span>";
                document.getElementById('admin-section').style.display = 'block';
            } else {
                document.getElementById('auth-status').innerHTML = "<span class='badge bg-success'>አባል: " + user + "</span>";
                document.getElementById('member-section').style.display = 'block';
            }
            loadIddirs();
        }

        async function createIddir() {
            const name = document.getElementById('id-name').value;
            const admin_name = document.getElementById('id-admin').value;
            const admin_phone = document.getElementById('id-phone').value;
            if(!name || !admin_name || !admin_phone) return;
            await fetch('/api/superadmin/create-iddir', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ name, admin_name, admin_phone })
            });
            alert("🎉 አዲስ እድር በተሳካ ሁኔታ ተፈጥሯል!");
            document.getElementById('id-name').value = "";
            document.getElementById('id-admin').value = "";
            document.getElementById('id-phone').value = "";
            loadIddirs();
        }

        async function saveAdminRules() {
            const fee = document.getElementById('adm-fee').value;
            const deadline = document.getElementById('adm-deadline').value;
            const b1 = document.getElementById('adm-bank1').value;
            const b2 = document.getElementById('adm-bank2').value;
            await fetch('/api/admin/setup-rules', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ iddir_id: selectedIddirId, monthly_fee: fee, deadline, bank_accounts: [b1, b2] })
            });
            alert("🏛️ መረጃዎቹ በይፋ ተለጥፈዋል!");
            loadIddirs();
        }

        function submitPayment() {
            alert("✅ የክፍያ መረጃዎ በትክክል ተልኳል!");
        }
    </script>
</body>
</html>
    `);
});

app.get('/api/get-db', (req, res) => { res.json(tempDB); });
app.post('/api/superadmin/create-iddir', (req, res) => {
    const { name, admin_name, admin_phone } = req.body;
    const iddir_id = "iddir_" + Date.now();
    tempDB.iddirs[iddir_id] = { name, admin_name, admin_phone, monthly_fee: 0, deadline: "-", bank_accounts: [] };
    res.json({ success: true });
});
app.post('/api/admin/setup-rules', (req, res) => {
    const { iddir_id, monthly_fee, deadline, bank_accounts } = req.body;
    if (tempDB.iddirs[iddir_id] || iddir_id === 'iddir_default') {
        let id = tempDB.iddirs[iddir_id] ? iddir_id : Object.keys(tempDB.iddirs)[0] || 'iddir_default';
        if(!tempDB.iddirs[id]) tempDB.iddirs[id] = { name: "እድር", admin_name: "አድሚን", admin_phone: "09" };
        tempDB.iddirs[id].monthly_fee = monthly_fee;
        tempDB.iddirs[id].deadline = deadline;
        tempDB.iddirs[id].bank_accounts = bank_accounts;
        res.json({ success: true });
    } else { res.status(404).json({ error: "Not found" }); }
});

app.listen(PORT, () => { console.log(`Server running on port ${PORT}`); });
