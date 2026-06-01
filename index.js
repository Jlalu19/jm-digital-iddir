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
    ],
    payments: [],
    loans: []
};

// 🌐 የሲስተሙ ዋና የፊት ገጽታ (Premium Master Dashboard)
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
        :root { 
            --bg-main: #0f172a; 
            --bg-card: #1e293b; 
            --accent: #f59e0b; 
            --accent-hover: #d97706; 
            --text-light: #f8fafc;
        }
        body { background-color: var(--bg-main); color: var(--text-light); font-family: 'Segoe UI', sans-serif; }
        .card-custom { background-color: var(--bg-card); border: 1px solid #334155; border-radius: 15px; padding: 25px; margin-bottom: 25px; box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
        .form-control-custom { background-color: #334155; border: 1px solid #475569; color: white; border-radius: 8px; padding: 10px; margin-bottom: 12px; }
        .form-control-custom:focus { background-color: #334155; color: white; border-color: var(--accent); box-shadow: none; }
        .btn-premium { background: linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 100%); color: #000; font-weight: bold; border: none; border-radius: 8px; padding: 10px 20px; }
        .btn-premium:hover { transform: translateY(-1px); color: #000; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3); }
        .btn-logout { background-color: #ef4444; color: white; border: none; font-weight: bold; border-radius: 6px; padding: 6px 15px; }
        .btn-logout:hover { background-color: #dc2626; color: white; }
        .culture-section { background: linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%); border-left: 5px solid var(--accent); padding: 20px; border-radius: 12px; margin-bottom: 25px; }
        .nav-tabs .nav-link { color: #94a3b8; border: none; }
        .nav-tabs .nav-link.active { background-color: var(--accent); color: black; font-weight: bold; border-radius: 8px; }
        .table-custom th { background-color: #334155 !important; color: var(--accent) !important; font-weight: bold; }
        .table-custom td { background-color: var(--bg-card) !important; color: white !important; border-color: #334155; vertical-align: middle; }
        .badge-active { background-color: #22c55e; color: black; font-weight: bold; padding: 6px 12px; border-radius: 20px; }
        .badge-suspended { background-color: #ef4444; color: white; font-weight: bold; padding: 6px 12px; border-radius: 20px; }
    </style>
</head>
<body>

    <nav class="navbar navbar-dark bg-dark border-bottom border-secondary py-3">
        <div class="container">
            <span class="navbar-brand fw-bold text-warning"><i class="fa-solid fa-gavel"></i> JM ዲጂታል እድር ማስተር ሲስተም</span>
            <div class="d-flex align-items-center gap-3">
                <div id="auth-status"></div>
                <button id="logout-btn" onclick="handleLogout()" class="btn btn-logout" style="display: none;"><i class="fa-solid fa-sign-out-alt"></i> ውጣ (Logout)</button>
            </div>
        </div>
    </nav>

    <div class="container my-4">
        
        <!-- 📜 የታሪክ ማህደር ክፍል -->
        <div id="culture-box" class="culture-section">
            <h5 class="text-warning fw-bold"><i class="fa-solid fa-book-open"></i> የእድር ታሪካዊ አመጣጥ እና የጉራጌ ባህል እሴት</h5>
            <p class="small text-light mb-0" style="line-height: 1.7; color: #cbd5e1 !important;">
                እድር በኢትዮጵያ ማህበረሰብ ውስጥ ለዘመናት የዘለቀ፣ በችግርም ሆነ በደስታ ጊዜ መረዳጃ ጠንካራ ማህበራዊ ተቋም ነው። ይህ ተቋም በተለይም ከጉራጌ ማህበረሰብ ባህላዊ እሴቶች እና አስተዳደር ስርዓት ጋር ጥልቅ ቁርኝት አለው። በጉራጌ ታሪክ ውስጥ የሚታወቀው የ <strong>የጆቃ ቂጫ (Yejoka Qicha)</strong> የዲሞክራሲያዊ የፍትህ እና የጋራ ውሳኔ መርሆዎች ማህበረሰቡ በሰላም፣ በፍትህ እና በአንድነት እንዲኖር መሰረት የጣለ የህግ ስብስብ ነው። የ JM ዲጂታል እድር ይህንን የቆየ የጋራ መደጋገፍ እና የአንድነት ባህል ከዘመናዊው የቴክኖሎጂ አሰራር ጋር በማዋሃድ፣ ለህዝባችን ፈጣን፣ ግልጽ እና አስተማማኝ አገልግሎት ለማበርከት የተፈጠረ የዘመኑ የዲጂታል ማህበረሰብ ቋት ነው!
            </p>
        </div>

        <!-- 🔐 የመግቢያ በይነገጽ (SECURE LOGIN) -->
        <div id="login-box" class="card-custom mx-auto" style="max-width: 400px; margin-top: 50px;">
            <h4 class="text-center fw-bold text-warning mb-3"><i class="fa-solid fa-user-shield"></i> ደህንነቱ የተጠበቀ መግቢያ</h4>
            <input type="text" id="login-user" class="form-control form-control-custom" placeholder="ስልክ ቁጥር ወይም 'superadmin'">
            <input type="password" id="login-pass" class="form-control form-control-custom" placeholder="የይለፍ ቃል">
            <button onclick="handleLogin()" class="btn btn-premium w-100 py-2 mt-2">ወደ ሲስተሙ ግባ</button>
            <div class="mt-3 text-center text-muted small">💡 ለሙከራ የይለፍ ቃል ለሁሉም፦ <strong>1234</strong> ነው!</div>
        </div>

        <!-- 📊 ዋናው ማስተር ዳሽቦርድ -->
        <div id="dashboard-box" style="display:none;">
            
            <!-- 👑 ሀ. የሱፐር አድሚን ገጽ (SUPERADMIN) -->
            <div id="superadmin-section" style="display:none;">
                <div class="card-custom">
                    <h5 class="text-warning fw-bold mb-3"><i class="fa-solid fa-plus-circle"></i> አዲስ እድር በሲስተሙ ላይ መመዝገቢያ ፎርም</h5>
                    <div class="row g-2">
                        <div class="col-md-3"><input type="text" id="s-id-name" class="form-control form-control-custom" placeholder="የእድር ስም"></div>
                        <div class="col-md-3"><input type="text" id="s-id-admin" class="form-control form-control-custom" placeholder="የኃላፊ ስም"></div>
                        <div class="col-md-3"><input type="text" id="s-id-phone" class="form-control form-control-custom" placeholder="የኃላፊ ስልክ"></div>
                        <div class="col-md-3"><input type="password" id="s-id-pass" class="form-control form-control-custom" placeholder="መግቢያ ፓስወርድ"></div>
                    </div>
                    <button onclick="superCreateIddir()" class="btn btn-premium mt-2">አዲስ እድር መዝግብ</button>
                </div>
                <div class="card-custom">
                    <h5 class="text-warning fw-bold mb-2"><i class="fa-solid fa-chart-line"></i> አጠቃላይ የሲስተሙ ክትትል ሰሌዳ (Analytics)</h5>
                    <div id="super-stats" class="row text-center my-3"></div>
                    <h5 class="text-warning fw-bold mt-4 mb-2"><i class="fa-solid fa-list"></i> የተመዘገቡ እድሮች አጠቃላይ ዝርዝርና የክትትል ሁኔታ (Status)</h5>
                    <table class="table table-custom table-bordered"><thead><tr class="table-dark text-warning"><th>መለያ ID</th><th>የእድር ስም</th><th>ኃላፊ</th><th>ስልክ ቁጥር</th><th>የእድር ሁኔታ (Status)</th></tr></thead><tbody id="super-iddirs-table"></tbody></table>
                </div>
            </div>

            <!-- 🛠️ ለ. የእድር አስተዳዳሪ ገጽ (IDDIR ADMIN) -->
            <div id="admin-section" style="display:none;">
                <ul class="nav nav-tabs mb-4" id="adminTabs" role="tablist">
                    <li class="nav-item"><button class="nav-link active" data-bs-toggle="tab" data-bs-target="#adm-m">አባላት መቆጣጠሪያ</button></li>
                    <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#adm-f">ገንዘብና ህግ ማስቀመጫ</button></li>
                    <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#adm-a">የእድር ንብረቶች</button></li>
                    <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#adm-n">ማስታወቂያ መለጠፊያ</button></li>
                </ul>
                <div class="tab-content">
                    <div class="tab-pane fade show active" id="adm-m">
                        <div class="card-custom">
                            <h5 class="text-warning fw-bold mb-3"><i class="fa-solid fa-user-plus"></i> አዲስ አባል መመዝገቢያ ፎርም</h5>
                            <div class="row g-2">
                                <div class="col-md-4"><input type="text" id="m-name" class="form-control form-control-custom" placeholder="የአባሉ ሙሉ ስም"></div>
                                <div class="col-md-4"><input type="text" id="m-phone" class="form-control form-control-custom" placeholder="የስልክ ቁጥር"></div>
                                <div class="col-md-4"><input type="password" id="m-pass" class="form-control form-control-custom" placeholder="መግቢያ ፓስወርድ"></div>
                            </div>
                            <button onclick="adminRegisterMember()" class="btn btn-premium mt-2">አባል መዝግብ</button>
                        </div>
                        <div class="card-custom">
                            <h5 class="text-warning fw-bold mb-2">የእድር አባላት ዝርዝር ሰሌዳ</h5>
                            <table class="table table-custom table-bordered">
                                <thead><tr><th>መለያ ID</th><th>የአባል ስም</th><th>ስልክ ቁጥር</th><th>ጥገኞች/ቤተሰብ</th><th>የፍላጎት ቁጠባ</th></tr></thead>
                                <tbody id="adm-members-table"></tbody>
                            </table>
                        </div>
                    </div>
                    <div class="tab-pane fade" id="adm-f">
                        <div class="card-custom">
                            <h5 class="text-warning fw-bold mb-3">ወርሃዊ መዋጮ፣ ጊዜ እና የባንክ አካውንት ማዘጋጃ</h5>
                            <div class="row g-2">
                                <div class="col-md-3"><input type="number" id="f-fee" class="form-control form-control-custom" placeholder="ወርሃዊ ክፍያ (ብር)"></div>
                                <div class="col-md-3"><input type="text" id="f-dead" class="form-control form-control-custom" placeholder="የመክፈያ ቀነ-ገደብ"></div>
                                <div class="col-md-3"><input type="text" id="f-b1" class="form-control form-control-custom" placeholder="የንግድ ባንክ መረጃ"></div>
                                <div class="col-md-3"><input type="text" id="f-b2" class="form-control form-control-custom" placeholder="የቴሌብር ቁጥር"></div>
                            </div>
                            <h5 class="text-warning fw-bold mt-3 mb-2"><i class="fa-solid fa-file-contract"></i> የእድሩ ቋሚ ህገ-ደንብ (ፅሁፍ እና PDF/Word/Image መጫኛ)</h5>
                            <textarea id="f-rules" class="form-control form-control-custom" rows="3" placeholder="የእድሩን ህግጋት እዚህ በፅሁፍ ይፃፉ..."></textarea>
                            <div class="mb-3">
                                <label class="form-label text-warning small fw-bold">የህገ-ደንብ ሰነድ መጫኛ (PDF, Word, or Image)፦</label>
                                <input type="file" id="f-document" class="form-control form-control-custom" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onchange="mockFileUpload(this)">
                                <div id="file-upload-status" class="text-success small mt-1"></div>
                            </div>
                            <button onclick="adminSaveRules()" class="btn btn-premium mt-2">ደንብና የፋይናንስ ህግ አውጣ</button>
                        </div>
                    </div>
                    <div class="tab-pane fade" id="adm-a">
                        <div class="card-custom">
                            <h5 class="text-warning fw-bold mb-3">የእድር ንብረቶች መመዝገቢያ ፎርም</h5>
                            <div class="row g-2">
                                <div class="col-md-6"><input type="text" id="a-name" class="form-control form-control-custom" placeholder="የንብረቱ ስም (ድንኳን... )"></div>
                                <div class="col-md-6"><input type="number" id="a-total" class="form-control form-control-custom" placeholder="አጠቃላይ ብዛት"></div>
                            </div>
                            <button onclick="adminAddAsset()" class="btn btn-premium mt-2">ንብረት መዝግብ</button>
                        </div>
                    </div>
                    <div class="tab-pane fade" id="adm-n">
                        <div class="card-custom">
                            <h5 class="text-warning fw-bold mb-3">አዲስ አጠቃላይ ማስታወቂያ ማሰራጫ ሰሌዳ</h5>
                            <input type="text" id="n-title" class="form-control form-control-custom" placeholder="የማስታወቂያው ርዕስ">
                            <textarea id="n-content" class="form-control form-control-custom" rows="3" placeholder="የማስታወቂያው ዝርዝር መልዕክት..."></textarea>
                            <button onclick="adminPostNotice()" class="btn btn-premium mt-2">ማስታወቂያ በትን</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 👤 ሐ. የተመዘገበ አባል ገጽ (MEMBER DASHBOARD) -->
            <div id="member-section" style="display:none;">
                <div class="row">
                    <div class="col-md-4">
                        <div class="card-custom text-center">
                            <i class="fa-solid fa-wallet text-warning fa-3x mb-2"></i>
                            <h5 class="fw-bold">የእኔ የቁጠባ ቋት (Wallet)</h5>
                            <h3 id="m-view-saving" class="text-success fw-bold">0 ብር</h3>
                            <p class="small text-muted mb-0 text-light">የፍላጎት ቁጠባ ድምር</p>
                        </div>
                    </div>
                    <div class="col-md-8">
                        <div class="card-custom">
                            <h5 class="text-warning fw-bold mb-2"><i class="fa-solid fa-bullhorn"></i> ወቅታዊ የእድር ማስታወቂያዎች</h5>
                            <div id="m-notice-display" class="alert alert-info bg-dark text-white border-secondary py-2 small"></div>
                        </div>
                    </div>
                </div>
                <ul class="nav nav-tabs mb-4" id="memberTabs" role="tablist">
                    <li class="nav-item"><button class="nav-link active" data-bs-toggle="tab" data-bs-target="#mem-p">ክፍያ መፈጸሚያ</button></li>
                    <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#mem-f">ቤተሰብ መመዝገቢያ</button></li>
                    <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#mem-r">ህገ-ደንብ ማውረጃ</button></li>
                    <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#mem-l">ዕቃ መበደሪያ</button></li>
                </ul>
                <div class="tab-content">
                    <div class="tab-pane fade show active" id="mem-p">
                        <div class="card-custom">
                            <div class="alert alert-warning text-dark fw-bold small mb-3">
                                📌 የእድር መክፈያ መረጃ፦ <br>
                                • ወርሃዊ መዋጮ፦ <span id="m-disp-fee"></span> ብር | • ቀነ-ገደብ፦ <span id="m-disp-dead"></span> <br>
                                • የባንክ አካውንቶች፦ <span id="m-disp-banks"></span>
                            </div>
                            <div class="row g-2">
                                <div class="col-md-4"><input type="number" id="p-amt" class="form-control form-control-custom" placeholder="የከፈሉት የብር መጠን"></div>
                                <div class="col-md-4">
                                    <select id="p-type" class="form-control form-control-custom">
                                        <option value="ወርሃዊ መዋጮ">ወርሃዊ መዋጮ</option>
                                        <option value="የፍላጎት ቁጠባ">የፍላጎት ቁጠባ</option>
                                    </select>
                                </div>
                                <div class="col-md-4"><input type="text" id="p-txn" class="form-control form-control-custom" placeholder="የትራንዛክሽን ቁጥር (Txn ID)"></div>
                            </div>
                            <button onclick="memberSubmitPayment()" class="btn btn-premium mt-2">የክፍያ ፎርም ለቦርድ አስረክብ</button>
                        </div>
                    </div>
                    <div class="tab-pane fade" id="mem-f">
                        <div class="card-custom">
                            <h5 class="text-warning fw-bold mb-3">በስርዎ ያሉ ጥገኞችን/ቤተሰብ መመዝገቢያ ፎርም</h5>
                            <input type="text" id="f-member-name" class="form-control form-control-custom" placeholder="የቤተሰብ ሙሉ ስም">
                            <button onclick="memberAddFamily()" class="btn btn-premium mt-2">ቤተሰብ አክል</button>
                            <h6 class="text-warning fw-bold mt-4">የተመዘገቡ የቤተሰብ አባላት ዝርዝር</h6>
                            <ul id="m-family-list" class="list-group list-group-flush bg-transparent"></ul>
                        </div>
                    </div>
                    <div class="tab-pane fade" id="mem-r">
                        <div class="card-custom">
                            <h5 class="text-warning fw-bold mb-2">የእድሩ ቋሚ ህገ-ደንብ ማውጫ ሰሌዳ</h5>
                            <div id="m-rules-display" class="p-3 bg-dark rounded border text-white mb-3" style="white-space: pre-wrap;"></div>
                            <div id="m-file-display"></div>
                        </div>
                    </div>
                    <div class="tab-pane fade" id="mem-l">
                        <div class="card-custom">
                            <h5 class="text-warning fw-bold mb-3">የእድር እቃዎችና ንብረቶች መበደሪያ ጥያቄ ፎርም</h5>
                            <input type="text" id="l-asset" class="form-control form-control-custom" placeholder="የሚፈልጉት የዕቃ ስም">
                            <input type="number" id="l-qty" class="form-control form-control-custom" placeholder="ብዛት">
                            <button onclick="alert('✅ የእቃ ብድር ጥያቄዎ ለአስተዳዳሪው ተልኳል!')" class="btn btn-premium mt-2">የብድር ጥያቄ አቅርብ</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        let sessionUser = null;
        let selectedIddirId = "iddir_default";
        let localUploadedFileName = "";
        
        // 🚨 ቋሚ የ Render ሊንክ አድራሻ (CORS እና HTTPS ስህተትን ለመፍታት)
        const BASE_URL = window.location.origin;

        function mockFileUpload(input) {
            if(input.files && input.files[0]) {
                localUploadedFileName = input.files[0].name;
                document.getElementById('file-upload-status').innerText = "📁 ሰነድ በተሳካ ሁኔታ ተመርጧል፦ " + localUploadedFileName;
            }
        }

        async function refreshData() {
            const res = await fetch(BASE_URL + '/api/master-db');
            const db = await res.json();
            
            const iddirKeys = Object.keys(db.iddirs);
            
            let statsHtml = "<div class='col-4'><div class='p-3 bg-dark border rounded'><h4 class='text-warning'>" + iddirKeys.length + "</h4>እድሮች</div></div>";
            statsHtml += "<div class='col-4'><div class='p-3 bg-dark border rounded'><h4 class='text-success'>" + db.members.length + "</h4>አባላት</div></div>";
            statsHtml += "<div class='col-4'><div class='p-3 bg-dark border rounded'><h4 class='text-info'>" + db.payments.length + "</h4>ክፍያዎች</div></div>";
            
            document.getElementById('super-stats').innerHTML = statsHtml;
            
            let sTable = "";
            iddirKeys.forEach(k => {
                let statusBadge = db.iddirs[k].status === "Active" ? "<span class='badge-active'><i class='fa-solid fa-circle-check'></i> Active</span>" : "<span class='badge-suspended'>Suspended</span>";
                sTable += "<tr><td>" + k + "</td><td>" + db.iddirs[k].name + "</td><td>" + db.iddirs[k].admin_name + "</td><td>" + db.iddirs[k].admin_phone + "</td><td>" + statusBadge + "</td></tr>";
            });
            document.getElementById('super-iddirs-table').innerHTML = sTable;

            let currentIddir = db.iddirs[selectedIddirId] || db.iddirs["iddir_default"];
            let mTable = "";
            db.members.filter(m => m.iddir_id === selectedIddirId).forEach(m => {
                let fams = m.family.join(', ') || 'የለም';
                mTable += "<tr><td>" + m.id + "</td><td>" + m.name + "</td><td>" + m.phone + "</td><td>" + fams + "</td><td>" + m.saving + " ብር</td></tr>";
            });
            document.getElementById('adm-members-table').innerHTML = mTable;

            if(sessionUser && sessionUser.role === 'member') {
                const me = db.members.find(m => m.phone === sessionUser.phone);
                if(me) {
                    document.getElementById('m-view-saving').innerText = me.saving + " ብር";
                    let fList = "";
                    me.family.forEach(f => {
                        fList += "<li class='list-group-item bg-transparent text-white border-secondary'>• " + f + "</li>";
                    });
                    document.getElementById('m-family-list').innerHTML = fList;
                }
                document.getElementById('m-disp-fee').innerText = currentIddir.monthly_fee || 0;
                document.getElementById('m-disp-dead').innerText = currentIddir.deadline || "-";
                document.getElementById('m-disp-banks').innerText = currentIddir.bank_accounts.join(' | ') || "ያልተገለጸ";
                document.getElementById('m-rules-display').innerText = currentIddir.rules || "ህገ-ደንብ በፅሁፍ አልተጫነም::";
                
                if(currentIddir.uploaded_file) {
                    document.getElementById('m-file-display').innerHTML = "<div class='alert alert-success bg-dark text-white border-success'><i class='fa-solid fa-file-arrow-down text-warning'></i> <strong>የተያያዘ የህገ-ደንብ ፋይል አለ፦</strong> <a href='#' class='text-warning' onclick='alert(\"ፋይሉን ማውረድ ይቻላል!\")'>" + currentIddir.uploaded_file + "</a></div>";
                } else {
                    document.getElementById('m-file-display').innerHTML = "";
                }
                
                document.getElementById('m-notice-display').innerText = currentIddir.notices[0] ? currentIddir.notices[0].title + "፦ " + currentIddir.notices[0].content : "ምንም አዲስ ማስታወቂያ የለም::";
            }
        }

        async function handleLogin() {
            const u = document.getElementById('login-user').value.trim();
            const p = document.getElementById('login-pass').value.trim();
            if(!u || !p) { alert("እባክዎ መረጃዎችን በትክክል ያስገቡ!"); return; }

            const res = await fetch(BASE_URL + '/api/master-db');
            const db = await res.json();

            if(u === 'superadmin' && p === '1234') {
                sessionUser = { role: 'superadmin' };
                document.getElementById('auth-status').innerHTML = "<span class='badge bg-danger p-2'><i class='fa-solid fa-user-shield'></i> ሱፐር አድሚን</span>";
                document.getElementById('superadmin-section').style.display = 'block';
            } else if(u === '0911000000' && p === '1234') {
                sessionUser = { role: 'admin', iddir_id: 'iddir_default' };
                selectedIddirId = "iddir_default";
                document.getElementById('auth-status').innerHTML = "<span class='badge bg-warning text-dark p-2'><i class='fa-solid fa-user-gear'></i> እድር አድሚን</span>";
                document.getElementById('admin-section').style.display = 'block';
            } else if(u === '0912345678' && p === '1234') {
                sessionUser = { role: 'member', phone: u };
                document.getElementById('auth-status').innerHTML = "<span class='badge bg-success p-2'><i class='fa-solid fa-user'></i> አባል ገጽ</span>";
                document.getElementById('member-section').style.display = 'block';
            } else {
                let foundAdminId = null;
                Object.keys(db.iddirs).forEach(k => {
                    if(db.iddirs[k].admin_phone === u && db.iddirs[k].admin_pass === p) {
                        foundAdminId = k;
                    }
                });

                let foundMember = db.members.find(m => m.phone === u && m.pass === p);

                if(foundAdminId) {
                    sessionUser = { role: 'admin', iddir_id: foundAdminId };
                    selectedIddirId = foundAdminId;
                    document.getElementById('auth-status').innerHTML = "<span class='badge bg-warning text-dark p-2'><i class='fa-solid fa-user-gear'></i> እድር አድሚን</span>";
                    document.getElementById('admin-section').style.display = 'block';
                } else if(foundMember) {
                    sessionUser = { role: 'member', phone: u };
                    selectedIddirId = foundMember.iddir_id;
                    document.getElementById('auth-status').innerHTML = "<span class='badge bg-success p-2'><i class='fa-solid fa-user'></i> አባል ገጽ</span>";
                    document.getElementById('member-section').style.display = 'block';
                } else {
                    alert("የተሳሳተ ስም ወይም የይለፍ ቃል!");
                    handleLogout();
                    return;
                }
            }

            document.getElementById('login-box').style.display = 'none';
            document.getElementById('dashboard-box').style.display = 'block';
            document.getElementById('logout-btn').style.display = 'block';
            document.getElementById('culture-box').style.display = 'none';
            refreshData();
        }

        function handleLogout() {
            sessionUser = null;
            document.getElementById('login-box').style.display = 'block';
            document.getElementById('dashboard-box').style.display = 'none';
            document.getElementById('logout-btn').style.display = 'none';
            document.getElementById('culture-box').style.display = 'block';
            document.getElementById('auth-status').innerHTML = "";
            document.getElementById('login-user').value = "";
            document.getElementById('login-pass').value = "";
            document.getElementById('superadmin-section').style.display = 'none';
            document.getElementById('admin-section').style.display = 'none';
            document.getElementById('member-section').style.display = 'none';
        }

        async function superCreateIddir() {
            const name = document.getElementById('s-id-name').value;
            const admin = document.getElementById('s-id-admin').value;
            const phone = document.getElementById('s-id-phone').value;
            const pass = document.getElementById('s-id-pass').value;
            if(!name || !admin || !phone || !pass) { alert("ሁሉንም ይሙሉ"); return; }
            await fetch(BASE_URL + '/api/super/create-iddir', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ name, admin, phone, pass })
            });
            alert("🎉 አዲስ እድር እና አድሚን በተሳካ ሁኔታ ተመዝግቧል!");
            refreshData();
        }

        async function adminRegisterMember() {
            const name = document.getElementById('m-name').value;
            const phone = document.getElementById('m-phone').value;
            const pass = document.getElementById('m-pass').value;
            if(!name || !phone || !pass) { alert("ሁሉንም ይሙሉ"); return; }
            await fetch(BASE_URL + '/api/admin/create-member', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ name, phone, pass, iddir_id: selectedIddirId })
            });
            alert("🎉 አዲስ አባል ተመዝግቧል!");
            refreshData();
        }

        async function adminSaveRules() {
            const fee = document.getElementById('f-fee').value;
            const dead = document.getElementById('f-dead').value;
            const b1 = document.getElementById('f-b1').value;
            const b2 = document.getElementById('f-b2').value;
            const rules = document.getElementById('f-rules').value;
            
            await fetch(BASE_URL + '/api/admin/save-rules', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ iddir_id: selectedIddirId, fee, dead, banks: [b1, b2], rules, fileName: localUploadedFileName })
            });
            alert("🏛️ የእድር የፋይናንስ ህግጋት፣ ደንብ እና የሰነድ ፋይል በተሳካ ሁኔታ ተለጥፏል!");
            refreshData();
        }

        async function adminPostNotice() {
            const t = document.getElementById('n-title').value;
            const c = document.getElementById('n-content').value;
            await fetch(BASE_URL + '/api/admin/post-notice', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ iddir_id: selectedIddirId, title: t, content: c })
            });
            alert("📢 ማስታወቂያው ለሁሉም አባላት በይፋ ተሰራጭቷል!");
            refreshData();
        }

        async function memberSubmitPayment() {
            const amt = document.getElementById('p-amt').value;
            const type = document.getElementById('p-type').value;
            const txn = document.getElementById('p-txn').value;
            await fetch(BASE_URL + '/api/member/pay', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ phone: sessionUser.phone, amt, type, txn })
            });
            alert("✅ የ " + type + " የክፍያ ፎርም ለቦርድ ቀርቧል!");
            refreshData();
        }

        async function memberAddFamily() {
            const name = document.getElementById('f-member-name').value;
            if(!name) return;
            await fetch(BASE_URL + '/api/member/add-family', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ phone: sessionUser.phone, name })
            });
            alert("✅ የቤተሰብ አባል ታክሏል!");
            document.getElementById('f-member-name').value = "";
            refreshData();
        }
    </script>
</body>
</html>
    `);
});

// APIs
app.get('/api/master-db', (req, res) => { res.json(masterDB); });
app.post('/api/super/create-iddir', (req, res) => {
    const { name, admin, phone, pass } = req.body;
    const id = "IDDIR_" + Date.now();
    masterDB.iddirs[id] = { name, admin_name: admin, admin_phone: phone, admin_pass: pass, monthly_fee: 0, deadline: "-", bank_accounts: [], rules: "", uploaded_file: "", status: "Active", assets: [], notices: [] };
    res.json({ success: true });
});
app.post('/api/admin/create-member', (req, res) => {
    const { name, phone, pass, iddir_id } = req.body;
    masterDB.members.push({ id: "M_" + Math.floor(100+Math.random()*900), name, phone, pass, iddir_id, family: [], saving: 0 });
    res.json({ success: true });
});
app.post('/api/admin/save-rules', (req, res) => {
    const { iddir_id, fee, dead, banks, rules, fileName } = req.body;
    if(masterDB.iddirs[iddir_id]) {
        masterDB.iddirs[iddir_id].monthly_fee = fee;
        masterDB.iddirs[iddir_id].deadline = dead;
        masterDB.iddirs[iddir_id].bank_accounts = banks;
        masterDB.iddirs[iddir_id].rules = rules;
        if(fileName) {
            masterDB.iddirs[iddir_id].uploaded_file = fileName;
        }
    }
    res.json({ success: true });
});
app.post('/api/admin/post-notice', (req, res) => {
    const { iddir_id, title, content } = req.body;
    if(masterDB.iddirs[iddir_id]) masterDB.iddirs[iddir_id].notices.unshift({ title, content });
    res.json({ success: true });
});
app.post('/api/member/pay', (req, res) => {
    const { phone, amt, type, txn } = req.body;
    const m = masterDB.members.find(mem => mem.phone === phone);
    if(m && type === "የፍላጎት ቁጠባ") m.saving += Number(amt);
    masterDB.payments.push({ phone, amt, type, txn, date: new Date() });
    res.json({ success: true });
});
app.post('/api/member/add-family', (req, res) => {
    const { phone, name } = req.body;
    const m = masterDB.members.find(mem => mem.phone === phone);
    if(m) m.family.push(name);
    res.json({ success: true });
});

app.listen(PORT, () => { console.log("Master Server running on " + PORT); });
