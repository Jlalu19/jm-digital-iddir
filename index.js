const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// 🗄️ ማስተር ዳታቤዝ
let masterDB = {
    iddirs: {
        "iddir_default": {
            name: "የጉብሬ አንድነት እድር",
            admin_name: "አቶ በላይነህ",
            admin_phone: "0911000000",
            admin_pass: "1234",
            monthly_fee: 200,
            deadline: "ከየወሩ 1 - 5 ቀን",
            bank_accounts: ["CBE: 1000123456789", "Telebirr: 0911000000"],
            rules: "1. በሰዓቱ ያልከፈለ 50 ብር ይቀጣል:: \n2. በልቅሶ ጊዜ ሁሉም አባል መገኘት አለበት::",
            uploaded_file: "የጉብሬ_አነት_እድር_ህገደንብ.pdf",
            status: "Active",
            assets: [
                { id: 1, name: "ትልቅ የሰርግ ድንኳን", total: 2, loaned: 0 },
                { id: 2, name: "ፕላስቲክ ወንበሮች", total: 200, loaned: 50 }
            ],
            notices: [
                { title: "የዘንድሮ መዋጮ ማስተካከያ", content: "የዘንድሮ ወርሃዊ መዋጮ በጠቅላላ ጉባኤ ውሳኔ መሰረት 200 ብር ሆኗል::" }
            ]
        }
    },
    members: [
        { id: "M-100", name: "ካሚል ሸምሱ", phone: "0912345678", pass: "1234", iddir_id: "iddir_default", family: ["አልማዝ በቀለ (ሚስት)", "ዮናስ ካሚል (ልጅ)"], saving: 500 }
    ]
};

// 🌐 የሲስተሙ ዋና የፊት ገጽታ 
app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(`
<!DOCTYPE html>
<html lang="am">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JM የዲጂታል እድር ማኔጅመንት ማስተር ሲስተም</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root { --bg-main: #0f172a; --bg-card: #1e293b; --accent: #f59e0b; --text-light: #f8fafc; }
        body { background-color: var(--bg-main); color: var(--text-light); font-family: 'Segoe UI', sans-serif; }
        .card-custom { background-color: var(--bg-card); border: 1px solid #334155; border-radius: 15px; padding: 25px; margin-bottom: 25px; }
        .form-control-custom { background-color: #334155; border: 1px solid #475569; color: white; border-radius: 8px; padding: 10px; margin-bottom: 12px; }
        .btn-premium { background: linear-gradient(135deg, var(--accent) 0%, #d97706 100%); color: #000; font-weight: bold; border: none; border-radius: 8px; padding: 10px 20px; }
        .culture-section { background: linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%); border-left: 5px solid var(--accent); padding: 20px; border-radius: 12px; }
    </style>
</head>
<body>

    <nav class="navbar navbar-dark bg-dark border-bottom border-secondary py-3">
        <div class="container">
            <span class="navbar-brand fw-bold text-warning"><i class="fa-solid fa-gavel"></i> JM ዲጂታል እድር ማስተር ሲስተም</span>
        </div>
    </nav>

    <div class="container my-4">
        
        <div id="culture-box" class="culture-section mb-4">
            <h5 class="text-warning fw-bold"><i class="fa-solid fa-book-open"></i> የእድር ታሪካዊ አመጣጥ እና የጉራጌ ባህል እሴት</h5>
            <p class="small text-muted mb-0 style="color: #cbd5e1 !important;">
                እድር በኢትዮጵያ ማህበረሰብ ውስጥ ለዘመናት የዘለቀ፣ በችግርም ሆነ በደስታ ጊዜ መረዳጃ ጠንካራ ማህበራዊ ተቋም ነው። የ JM ዲጂታል እድር የቆየውን የጋራ መደጋገፍ ባህል ከዘመናዊው የቴክኖሎጂ አሰራር ጋር በማዋሃድ የተፈጠረ የዘመኑ የዲጂታል ማህበረሰብ ቋት ነው!
            </p>
        </div>

        <div id="login-box" class="card-custom mx-auto" style="max-width: 400px; margin-top: 50px;">
            <h4 class="text-center fw-bold text-warning mb-3"><i class="fa-solid fa-user-shield"></i> ደህንነቱ የተጠበቀ መግቢያ</h4>
            <input type="text" id="login-user" class="form-control form-control-custom" placeholder="ስልክ ቁጥር ወይም 'superadmin'">
            <input type="password" id="login-pass" class="form-control form-control-custom" placeholder="የይለፍ ቃል">
            <button onclick="localLogin()" class="btn btn-premium w-100 py-2 mt-2">ወደ ሲስተሙ ግባ</button>
            <div class="mt-3 text-center text-muted small">💡 ለሙከራ የይለፍ ቃል ለሁሉም፦ <strong>1234</strong> ነው!</div>
        </div>

        <div id="dashboard-box" class="card-custom text-center" style="display:none; margin-top: 50px;">
            <i class="fa-solid fa-circle-check text-success fa-4x mb-3"></i>
            <h2 class="text-success fw-bold">እንኳን በደህና መጡ!</h2>
            <p class="lead mt-2">የ JM ዲጂታል እድር መግቢያ በር በተሳካ ሁኔታ ሰርቷል።</p>
            <div class="alert alert-info bg-dark text-white mt-3">
                📍 የተፈቀደልዎት ሚና፦ <strong id="user-role" class="text-warning"></strong>
            </div>
            <button onclick="window.location.reload()" class="btn btn-danger mt-3">ውጣ (Logout)</button>
        </div>

    </div>

    <script>
        // 🔒 መግቢያውን ቀጥታ እዚህ ብሮውዘሩ ላይ እንዲያረጋግጥ አደረግነው (API መለመን ቀረ!)
        function localLogin() {
            const u = document.getElementById('login-user').value.trim();
            const p = document.getElementById('login-pass').value.trim();
            
            if(!u || !p) { alert("እባክዎ መረጃዎችን ያስገቡ!"); return; }

            if(u === 'superadmin' && p === '1234') {
                showDashboard('👑 ሱፐር አድሚን (Superadmin)');
            } else if(u === '0911000000' && p === '1234') {
                showDashboard('🛠️ የእድር አስተዳዳሪ (Iddir Admin - የጉብሬ አንድነት እድር)');
            } else if(u === '0912345678' && p === '1234') {
                showDashboard('👤 የእድር አባል (Member Dashboard - ካሚል ሸምሱ)');
            } else {
                alert("❌ የገቡት መረጃ አልተገኘም! እባክዎ በ '1234' ፓስወርድ ድጋሚ ይሞክሩ።");
            }
        }

        function showDashboard(roleName) {
            document.getElementById('login-box').style.display = 'none';
            document.getElementById('culture-box').style.display = 'none';
            document.getElementById('dashboard-box').style.display = 'block';
            document.getElementById('user-role').innerText = roleName;
        }
    </script>
</body>
</html>
    `);
});

app.listen(PORT, () => { console.log("Server running on " + PORT); });
