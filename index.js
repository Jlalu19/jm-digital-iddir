const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// 🌐 የሲስተሙ ዋና የፊት ገጽታ እና ሙሉ ስራዎች (Everything is beautifully rendered inside)
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
        
        <div id="culture-box" class="culture-section">
            <h5 class="text-warning fw-bold"><i class="fa-solid fa-book-open"></i> የእድር ታሪካዊ አመጣጥ እና የጉራጌ ባህል እሴት</h5>
            <p class="small text-light mb-0" style="line-height: 1.7; color: #cbd5e1 !important;">
                እድር በኢትዮጵያ ማህበረሰብ ውስጥ ለዘመናት የዘለቀ፣ በችግርም ሆነ በደስታ ጊዜ መረዳጃ ጠንካራ ማህበራዊ ተቋም ነው። ይህ ተቋም በተለይም ከጉራጌ ማህበረሰብ ባህላዊ እሴቶች እና አስተዳደር ስርዓት ጋር ጥልቅ ቁርኝት አለው። በጉራጌ ታሪክ ውስጥ የሚታወቀው የ <strong>የጆቃ ቂጫ (Yejoka Qicha)</strong> የዲሞክራሲያዊ የፍትህ እና የጋራ ውሳኔ መርሆዎች ማህበረሰቡ በሰላም፣ በፍትህ እና በአንድነት እንዲኖር መሰረት የጣለ የህግ ስብስብ ነው። የ JM ዲጂታል እድር ይህንን የቆየ የጋራ መደጋገፍ እና የአንድነት ባህል ከዘመናዊው የቴክኖሎጂ አሰራር ጋር በማዋሃድ፣ ለህዝባችን ፈጣን፣ ግልጽ እና አስተማማኝ አገልግሎት ለማበርከት የተፈጠረ የዘመኑ የዲጂታል ማህበረሰብ ቋት ነው!
            </p>
        </div>

        <div id="login-box" class="card-custom mx-auto" style="max-width: 400px; margin-top: 50px;">
            <h4 class="text-center fw-bold text-warning mb-3"><i class="fa-solid fa-user-shield"></i> ደህንነቱ የተጠበቀ መግቢያ</h4>
            <input type="text" id="login-user" class="form-control form-control-custom" placeholder="ስልክ ቁጥር ወይም 'superadmin'">
            <input type="password" id="login-pass" class="form-control form-control-custom" placeholder="የይለፍ ቃል">
            <button onclick="handleLogin()" class="btn btn-premium w-100 py-2 mt-2">ወደ ሲስተሙ ግባ</button>
            <div class="mt-3 text-center text-muted small">💡 ለሙከራ የይለፍ ቃል ለሁሉም፦ <strong>1234</strong> ነው!</div>
        </div>

        <div id="dashboard-box" style="display:none;">
            
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
                    <div id="super-stats" class="row text-center my-3">
                        <div class='col-4'><div class='p-3 bg-dark border rounded'><h4 class='text-warning' id="stat-iddirs">1</h4>እድሮች</div></div>
                        <div class='col-4'><div class='p-3 bg-dark border rounded'><h4 class='text-success' id="stat-members">1</h4>አባላት</div></div>
                        <div class='col-4'><div class='p-3 bg-dark border rounded'><h4 class='text-info' id="stat-payments">0</h4>ክፍያዎች</div></div>
                    </div>
                    <h5 class="text-warning fw-bold mt-4 mb-2"><i class="fa-solid fa-list"></i> የተመዘገቡ እድሮች አጠቃላይ ዝርዝርና የክትትል ሁኔታ (Status)</h5>
                    <table class="table table-custom table-bordered"><thead><tr class="table-dark text-warning"><th>መለያ ID</th><th>የእድር ስም</th><th>ኃላፊ</th><th>ስልክ ቁጥር</th><th>የእድር ሁኔታ (Status)</th></tr></thead><tbody id="super-iddirs-table"></tbody></table>
                </div>
            </div>

            <div id="admin-section" style="display:none;">
                <ul class="nav nav-tabs mb-4" role="tablist">
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
                                <div class="col-md-3"><input type="number" id="f-fee" class="form-control form-control-custom" value="200"></div>
                                <div class="col-md-3"><input type="text" id="f-dead" class="form-control form-control-custom" value="ከየወሩ 1 - 5 ቀን"></div>
                                <div class="col-md-3"><input type="text" id="f-b1" class="form-control form-control-custom" value="CBE: 1000123456789"></div>
                                <div class="col-md-3"><input type="text" id="f-b2" class="form-control form-control-custom" value="Telebirr: 0911000000"></div>
                            </div>
                            <h5 class="text-warning fw-bold mt-3 mb-2"><i class="fa-solid fa-file-contract"></i> የእድሩ ቋሚ ህገ-ደንብ</h5>
                            <textarea id="f-rules" class="form-control form-control-custom" rows="3">1. በሰዓቱ ያልከፈለ 50 ብር ይቀጣል:: \n2. በልቅሶ ጊዜ ሁሉም አባል መገኘት አለበት::</textarea>
                            <button onclick="alert('🏛️ የእድር የፋይናንስ ህግጋትና ደንብ በተሳካ ሁኔታ ተለጥፏል!')" class="btn btn-premium mt-2">ደንብና የፋይናንስ ህግ አውጣ</button>
                        </div>
                    </div>
                    <div class="tab-pane fade" id="adm-a">
                        <div class="card-custom">
                            <h5 class="text-warning fw-bold mb-3">የእድር ንብረቶች መመዝገቢያ ፎርም</h5>
                            <table class="table table-custom table-bordered">
                                <thead><tr><th>የንብረት ስም</th><th>አጠቃላይ ብዛት</th><th>የተበደረ</th></tr></thead>
                                <tbody>
                                    <tr><td>ትልቅ የሰርግ ድንኳን</td><td>2</td><td>0</td></tr>
                                    <tr><td>ፕላስቲክ ወንበሮች</td><td>200</td><td>50</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="tab-pane fade" id="adm-n">
                        <div class="card-custom">
                            <h5 class="text-warning fw-bold mb-3">አዲስ አጠቃላይ ማስታወቂያ ማሰራጫ ሰሌዳ</h5>
                            <input type="text" id="n-title" class="form-control form-control-custom" value="የዘንድሮ መዋጮ ማስተካከያ">
                            <textarea id="n-content" class="form-control form-control-custom" rows="3">የዘንድሮ ወርሃዊ መዋጮ በጠቅላላ ጉባኤ ውሳኔ መሰረት 200 ብር ሆኗል::</textarea>
                            <button onclick="alert('📢 ማስታወቂያው ለሁሉም አባላት በይፋ ተሰራጭቷል!')" class="btn btn-premium mt-2">ማስታወቂያ በትን</button>
                        </div>
                    </div>
                </div>
            </div>

            <div id="member-section" style="display:none;">
                <div class="row">
                    <div class="col-md-4">
                        <div class="card-custom text-center">
                            <i class="fa-solid fa-wallet text-warning fa-3x mb-2"></i>
                            <h5 class="fw-bold">የእኔ የቁጠባ ቋት (Wallet)</h5>
                            <h3 class="text-success fw-bold">500 ብር</h3>
                            <p class="small text-muted mb-0 text-light">የፍላጎት ቁጠባ ድምር</p>
                        </div>
                    </div>
                    <div class="col-md-8">
                        <div class="card-custom">
                            <h5 class="text-warning fw-bold mb-2"><i class="fa-solid fa-bullhorn"></i> ወቅታዊ የእድር ማስታወቂያዎች</h5>
                            <div class="alert alert-info bg-dark text-white border-secondary py-2 small">
                                <strong>የዘንድሮ መዋጮ ማስተካከያ፦</strong> የዘንድሮ ወርሃዊ መዋጮ በጠቅላላ ጉባኤ ውሳኔ መሰረት 200 ብር ሆኗል::
                            </div>
                        </div>
                    </div>
                </div>
                <ul class="nav nav-tabs mb-4" role="tablist">
                    <li class="nav-item"><button class="nav-link active" data-bs-toggle="tab" data-bs-target="#mem-p">ክፍያ መፈጸሚያ</button></li>
                    <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#mem-f">ቤተሰብ መመዝገቢያ</button></li>
                    <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#mem-r">ህገ-ደንብ ማውረጃ</button></li>
                </ul>
                <div class="tab-content">
                    <div class="tab-pane fade show active" id="mem-p">
                        <div class="card-custom">
                            <div class="alert alert-warning text-dark fw-bold small mb-3">
                                📌 የእድር መክፈያ መረጃ፦ <br>
                                • ወርሃዊ መዋጮ፦ 200 ብር | • ቀነ-ገደብ፦ ከየወሩ 1 - 5 ቀን <br>
                                • የባንክ አካውንቶች፦ CBE: 1000123456789 | Telebirr: 0911000000
                            </div>
                            <div class="row g-2">
                                <div class="col-md-4"><input type="number" id="p-amt" class="form-control form-control-custom" placeholder="የከፈሉት የብር መጠን"></div>
                                <div class="col-md-4">
                                    <select class="form-control form-control-custom">
                                        <option value="ወርሃዊ መዋጮ">ወርሃዊ መዋጮ</option>
                                        <option value="የፍላጎት ቁጠባ">የፍላጎት ቁጠባ</option>
                                    </select>
                                </div>
                                <div class="col-md-4"><input type="text" id="p-txn" class="form-control form-control-custom" placeholder="የትራንዛክሽን ቁጥር (Txn ID)"></div>
                            </div>
                            <button onclick="alert('✅ የክፍያ ፎርም ለቦርድ አስረክቧል!')" class="btn btn-premium mt-2">የክፍያ ፎርም ለቦርድ አስረክብ</button>
                        </div>
                    </div>
                    <div class="tab-pane fade" id="mem-f">
                        <div class="card-custom">
                            <h5 class="text-warning fw-bold mb-3">በስርዎ ያሉ ጥገኞችን/ቤተሰብ መመዝገቢያ ፎርም</h5>
                            <input type="text" id="f-member-name" class="form-control form-control-custom" placeholder="የቤተሰብ ሙሉ ስም">
                            <button onclick="alert('✅ ቤተሰብ ታክሏል!')" class="btn btn-premium mt-2">ቤተሰብ አክል</button>
                            <h6 class="text-warning fw-bold mt-4">የተመዘገቡ የቤተሰብ አባላት ዝርዝር</h6>
                            <ul class="list-group list-group-flush bg-transparent">
                                <li class='list-group-item bg-transparent text-white border-secondary'>• አልማዝ በቀለ (ሚስት)</li>
                                <li class='list-group-item bg-transparent text-white border-secondary'>• ዮናስ ካሚል (ልጅ)</li>
                            </ul>
                        </div>
                    </div>
                    <div class="tab-pane fade" id="mem-r">
                        <div class="card-custom">
                            <h5 class="text-warning fw-bold mb-2">የእድሩ ቋሚ ህገ-ደንብ ማውጫ ሰሌዳ</h5>
                            <div class="p-3 bg-dark rounded border text-white mb-3" style="white-space: pre-wrap;">
1. በሰዓቱ ያልከፈለ 50 ብር ይቀጣል:: 
2. በልቅሶ ጊዜ ሁሉም አባል መገኘት አለበት::
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        // 🔒 የአካባቢ ዴታቤዝ (CORSን ሙሉ በሙሉ ለማለፍ እዚሁ ተቀመጠ)
        let localDB = {
            iddirs: [
                { id: "IDDIR_01", name: "የጉብሬ አንድነት እድር", admin: "አቶ በላይነህ", phone: "0911000000" }
            ],
            members: [
                { id: "M-100", name: "ካሚል ሸምሱ", phone: "0912345678", family: "2", saving: "500" }
            ]
        };

        function renderData() {
            // Superadmin table
            let sHtml = "";
            localDB.iddirs.forEach(i => {
                sHtml += "<tr><td>" + i.id + "</td><td>" + i.name + "</td><td>" + i.admin + "</td><td>" + i.phone + "</td><td><span class='badge-active'>Active</span></td></tr>";
            });
            document.getElementById('super-iddirs-table').innerHTML = sHtml;

            // Admin table
            let mHtml = "";
            localDB.members.forEach(m => {
                mHtml += "<tr><td>" + m.id + "</td><td>" + m.name + "</td><td>" + m.phone + "</td><td>" + m.family + " አባላት</td><td>" + m.saving + " ብር</td></tr>";
            });
            document.getElementById('adm-members-table').innerHTML = mHtml;
            
            document.getElementById('stat-iddirs').innerText = localDB.iddirs.length;
            document.getElementById('stat-members').innerText = localDB.members.length;
        }

        function handleLogin() {
            const u = document.getElementById('login-user').value.trim();
            const p = document.getElementById('login-pass').value.trim();
            if(!u || !p) { alert("እባክዎ መረጃዎችን ያስገቡ!"); return; }

            if(u === 'superadmin' && p === '1234') {
                showDashboard("<span class='badge bg-danger p-2'><i class='fa-solid fa-user-shield'></i> ሱፐር አድሚን</span>", 'superadmin-section');
            } else if(u === '0911000000' && p === '1234') {
                showDashboard("<span class='badge bg-warning text-dark p-2'><i class='fa-solid fa-user-gear'></i> እድር አድሚን</span>", 'admin-section');
            } else if(u === '0912345678' && p === '1234') {
                showDashboard("<span class='badge bg-success p-2'><i class='fa-solid fa-user'></i> አባል ገጽ</span>", 'member-section');
            } else {
                alert("የተሳሳተ ስም ወይም የይለፍ ቃል!");
            }
        }

        function showDashboard(badgeHtml, sectionId) {
            document.getElementById('login-box').style.display = 'none';
            document.getElementById('culture-box').style.display = 'none';
            document.getElementById('dashboard-box').style.display = 'block';
            document.getElementById('logout-btn').style.display = 'block';
            document.getElementById('auth-status').innerHTML = badgeHtml;
            
            document.getElementById('superadmin-section').style.display = 'none';
            document.getElementById('admin-section').style.display = 'none';
            document.getElementById('member-section').style.display = 'none';
            
            document.getElementById(sectionId).style.display = 'block';
            renderData();
        }

        function superCreateIddir() {
            const name = document.getElementById('s-id-name').value;
            const admin = document.getElementById('s-id-admin').value;
            const phone = document.getElementById('s-id-phone').value;
            const pass = document.getElementById('s-id-pass').value;
            if(!name || !admin || !phone || !pass) { alert("እባክዎ ሁሉንም ይሙሉ!"); return; }
            localDB.iddirs.push({ id: "IDDIR_" + Date.now().toString().slice(-4), name, admin, phone });
            alert("🎉 አዲስ እድር በተሳካ ሁኔታ ተመዝግቧል!");
            renderData();
        }

        function adminRegisterMember() {
            const name = document.getElementById('m-name').value;
            const phone = document.getElementById('m-phone').value;
            const pass = document.getElementById('m-pass').value;
            if(!name || !phone || !pass) { alert("እባክዎ ሁሉንም ይሙሉ!"); return; }
            localDB.members.push({ id: "M-" + Math.floor(100+Math.random()*900), name, phone, family: "0", saving: "0" });
            alert("🎉 አዲስ አባል ተመዝግቧል!");
            renderData();
        }

        function handleLogout() {
            window.location.reload();
        }
    </script>
</body>
</html>
    `);
});

app.listen(PORT, () => { console.log("Master Server running on " + PORT); });
