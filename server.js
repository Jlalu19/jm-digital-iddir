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

// 🌐 ዋናው ገጽ (HTML FRONTEND INTEGRATED)
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
        .form-control { background-color: #1f293d; border: 1px solid #334155; color: white; border-radius: 8px; }
        .btn-premium { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #000; font-weight: bold; border: none; }
        .btn-success-custom { background: linear-gradient(135deg, #10b981 0%, #059669 100%); border: none; color: white; }
        .culture-section { background: #1e1b4b; border-left: 5px solid var(--accent); padding: 20px; border-radius: 12px; }
    </style>
</head>
<body>
    <nav class="navbar navbar-dark bg-dark py-3">
        <div class="container">
            <span class="navbar-brand fw-bold text-warning">🏛️ JM ዲጂታል እድር ሲስተም</span>
            <div id="auth-status" class="text-light small"></div>
        </div>
    </nav>

    <div class="container my-5">
        <div class="culture-section mb-5">
            <h4 class="text-warning fw-bold"><i class="fa-solid fa-book-open"></i> የእድር ታሪካዊ አመጣጥ እና የጉራጌ ባህል እሴት</h4>
            <p class="mt-2 text-light" style="line-height: 1.8;">
                እድር በኢትዮጵያ ማህበረሰብ ውስጥ ለዘመናት የዘለቀ፣ በችግርም ሆነ በደስታ ጊዜ መረዳጃ ጠንካራ ማህበራዊ ተቋም ነው። ይህ ተቋም በተለይም ከጉራጌ ማህበረሰብ ባህላዊ እሴቶች እና አስተዳደር ስርዓት ጋር ጥልቅ ቁርኝት አለው። በጉራጌ ታሪክ ውስጥ የሚታወቀው የ <strong>የጆቃ ቂጫ (Yejoka Qicha)</strong> የዲሞክራሲያዊ የፍትህ እና የጋራ ውሳኔ መርሆዎች ማህበረሰቡ በሰላም፣ በፍትህ እና በአንድነት እንዲኖር መሰረት የጣለ የህግ ስብስብ ነው。 የ JM ዲጂታል እድር ይህንን የቆየ የጋራ መደጋገፍ እና የአንድነት ባህል ከዘመናዊው የቴክኖሎጂ አሰራር ጋር በማዋሃድ፣ ለህዝባችን ፈጣን፣ ግልጽ እና አስተማማኝ አገልግሎት ለማበርከት የተፈጠረ የዘመኑ የዲጂታል ማህበረሰብ ቋት ነው!
            </p>
        </div>

        <div id="login-box" class="card p-4 mx-auto" style="max-width: 400px;">
            <h4 class="text-center fw-bold text-warning mb-3">ደህንነቱ የተጠበቀ መግቢያ</h4>
            <div class="mb-3"><input type="text" id="login-user" class="form-control" placeholder="superadmin ወይም አድሚን ስልክ"></div>
            <div class="mb-3"><input type="password" id="login-pass" class="form-control" value="password123"></div>
            <button onclick="handleLogin()" class="btn btn-premium w-100">ግባ</button>
        </div>

        <div id="dashboard-box" style="display:none;">
            <div id="superadmin-section" style="display:none;">
                <div class="card p-4">
                    <h5 class="text-warning fw-bold mb-3">አዲስ እድር መመዝገቢያ</h5>
                    <div class="row g-3">
                        <div class="col-md-3"><input type="text" id="id-name" class="form-control" placeholder="የእድር ስም"></div>
                        <div class="col-md-3"><input type="text" id="id-admin" class="form-control" placeholder="የአስተዳዳሪ ስም"></div>
                        <div class="col-md-3"><input type="text" id="id-phone" class="form-control" placeholder="የአድሚን ስልክ"></div>
                        <div class="col-md-3"><input type="password" id="id-pass" class="form-control" placeholder="የአድሚን ፓስወርድ"></div>
                    </div>
                    <button onclick="createIddir()" class="btn btn-premium mt-3">እድር ፍጠር</button>
                </div>
            </div>

            <div id="admin-section" style="display:none;">
                <div class="card p-4">
                    <h5 class="text-warning fw-bold mb-3">የመዋጮ እና የባንክ አካውንት መጫኛ</h5>
                    <div class="row g-3 mb-3">
                        <div class="col-md-6"><input type="number" id="adm-fee" class="form-control" placeholder="ወርሃዊ መዋጮ"></div>
                        <div class="col-md-6"><input type="text" id="adm-deadline" class="form-control" placeholder="ቀነ-ገደብ"></div>
                    </div>
                    <div class="row g-3">
                        <div class="col-md-6"><input type="text" id="adm-bank1" class="form-control" placeholder="ንግድ ባንክ አካውንት"></div>
                        <div class="col-md-6"><input type="text" id="adm-bank2" class="form-control" placeholder="ቴሌብር ቁጥር"></div>
                    </div>
                    <button onclick="saveAdminRules()" class="btn btn-premium mt-3">መረጃዎቹን በይፋ ስቅለህ አውጣ</button>
                </div>
            </div>

            <div id="member-section" style="display:none;">
                <div class="card p-4">
                    <h5 class="text-warning fw-bold mb-3">በባንክ መክፈያ እና ደረሰኝ ማስገቢያ</h5>
                    <div id="member-bank-info" class="alert alert-info small">የባንክ መረጃዎች እዚህ ይታያሉ...</div>
                    <div class="mb-3"><input type="number" id="p-amount" class="form-control" placeholder="የገንዘብ መጠን"></div>
                    <div class="mb-3"><input type="text" id="p-bank" class="form-control" placeholder="የባንክ ስም"></div>
                    <div class="mb-3"><input type="text" id="p-txn" class="form-control" placeholder="የትራንዛክሽን ቁጥር (Txn ID)"></div>
                    <button onclick="submitPayment()" class="btn btn-premium w-100">የክፍያ ፎርም ላክ</button>
                </div>
            </div>
        </div>
    </div>

    <script>
        let session = { role: "", iddir_id: "iddir_default" };
        function handleLogin() {
            const user = document.getElementById('login-user').value.trim();
            document.getElementById('login-box').style.display = 'none';
            document.getElementById('dashboard-box').style.display = 'block';
            if(user === 'superadmin') {
                document.getElementById('superadmin-section').style.display = 'block';
            } else if(user === 'admin') {
                document.getElementById('admin-section').style.display = 'block';
            } else {
                document.getElementById('member-section').style.display = 'block';
            }
        }
        async function createIddir() {
            const name = document.getElementById('id-name').value;
            const admin_name = document.getElementById('id-admin').value;
            const admin_phone = document.getElementById('id-phone').value;
            const admin_pass = document.getElementById('id-pass').value;
            const res = await fetch('/api/superadmin/create-iddir', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ name, admin_name, admin_phone, admin_pass })
            });
            const data = await res.json();
            if(data.success) { session.iddir_id = data.iddir_id; alert("እድር ተፈጠረ!"); }
        }
        async function saveAdminRules() {
            const fee = document.getElementById('adm-fee').value;
            const deadline = document.getElementById('adm-deadline').value;
            const b1 = document.getElementById('adm-bank1').value;
            const b2 = document.getElementById('adm-bank2').value;
            await fetch('/api/admin/setup-rules', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ iddir_id: session.iddir_id, monthly_fee: fee, deadline, bank_accounts: [b1, b2] })
            });
            alert("የባንክ መረጃዎች ተለጥፈዋል!");
        }
    </script>
</body>
</html>
    `);
});

// APIs
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
    if (db.iddirs[iddir_id]) {
        db.iddirs[iddir_id].monthly_fee = monthly_fee;
        db.iddirs[iddir_id].deadline = deadline;
        db.iddirs[iddir_id].bank_accounts = bank_accounts;
        writeDB(db);
        res.json({ success: true });
    } else { res.status(404).json({ error: "Not found" }); }
});

app.listen(PORT, () => { console.log(`Server running on port ${PORT}`); });
