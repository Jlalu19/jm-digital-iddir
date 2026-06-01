const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let tempDB = { iddirs: {}, members: [], payments: [] };

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(`
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>JM የዲጂታል እድር ማኔጅመንት</title>
        <style>
            body { background-color: #0b0f19; color: #fff; font-family: sans-serif; padding: 20px; text-align: center; }
            .card { background-color: #141b2d; border: 1px solid #1f293d; border-radius: 12px; padding: 20px; max-width: 500px; margin: 20px auto; }
            input { width: 80%; padding: 10px; margin: 10px 0; background: #1f293d; border: 1px solid #334155; color: white; border-radius: 6px; }
            button { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: black; font-weight: bold; border: none; padding: 12px 25px; border-radius: 6px; cursor: pointer; }
            .culture { background: #1e1b4b; border-left: 5px solid #f59e0b; padding: 15px; border-radius: 8px; text-align: left; max-width: 600px; margin: 20px auto; font-size: 14px; line-height: 1.6; }
        </style>
    </head>
    <body>
        <h2>🏛️ JM ዲጂታል እድር ሲስተም</h2>
        
        <div class="culture">
            <strong>የእድር ታሪካዊ አመጣጥ እና የጉራጌ ባህል እሴት፦</strong><br>
            እድር በኢትዮጵያ ማህበረሰብ ውስጥ ለዘመናት የዘለቀ መረዳጃ ተቋም ነው። በጉራጌ ታሪክ ውስጥ የሚታወቀው የ <strong>የጆቃ ቂጫ (Yejoka Qicha)</strong> የዲሞክራሲያዊ የፍትህ መርሆዎች ማህበረሰቡ በአንድነት እንዲኖር መሰረት የጣለ የህግ ስብስብ ነው። የ JM ዲጂታል እድር ይህንን የአንድነት ባህል ከቴክኖሎጂ ጋር በማዋሃድ የተፈጠረ የዘመኑ የዲጂታል ማህበረሰብ ቋት ነው!
        </div>

        <div id="login-box" class="card">
            <h3>ደህንነቱ የተጠበቀ መግቢያ</h3>
            <input type="text" id="login-user" placeholder="superadmin, admin, ወይም የአባል ስም"><br>
            <button onclick="handleLogin()">ግባ</button>
        </div>

        <div id="dashboard" class="card" style="display:none;">
            <h4 id="status" style="color:#f59e0b;"></h4>
            <div id="superadmin-section" style="display:none;">
                <input type="text" id="id-name" placeholder="የእድር ስም"><br>
                <input type="text" id="id-admin" placeholder="የአስተዳዳሪ ስም"><br>
                <input type="text" id="id-phone" placeholder="የአድሚን ስልክ ቁጥር"><br>
                <button onclick="createIddir()">እድር ፍጠር</button>
                <div id="list" style="margin-top:15px; text-align:left;"></div>
            </div>
            <div id="admin-section" style="display:none;">
                <input type="number" id="adm-fee" placeholder="የመዋጮ መጠን"><br>
                <input type="text" id="adm-bank1" placeholder="የንግድ ባንክ አካውንት"><br>
                <button onclick="alert('🏛️ መረጃው ተለጥፏል!')">ህግ አውጣ</button>
            </div>
            <div id="member-section" style="display:none;">
                <p>📌 መዋጮ፡ 200 ብር | ንግድ ባንክ፡ 1000XXXXXXXX</p>
                <input type="text" id="p-txn" placeholder="የትራንዛክชั่น ቁጥር (Txn ID)"><br>
                <button onclick="alert('✅ ክፍያው ተልኳል!')">ፎርም አስረክብ</button>
            </div>
        </div>

        <script>
            function handleLogin() {
                const u = document.getElementById('login-user').value.trim().toLowerCase();
                if(!u) return;
                document.getElementById('login-box').style.display = 'none';
                document.getElementById('dashboard').style.display = 'block';
                document.getElementById('superadmin-section').style.display = 'none';
                document.getElementById('admin-section').style.display = 'none';
                document.getElementById('member-section').style.display = 'none';

                if(u === 'superadmin') {
                    document.getElementById('status').innerText = "ሚና፡ ሱፐር አድሚን";
                    document.getElementById('superadmin-section').style.display = 'block';
                } else if(u === 'admin') {
                    document.getElementById('status').innerText = "ሚና፡ እድር አድሚን";
                    document.getElementById('admin-section').style.display = 'block';
                } else {
                    document.getElementById('status').innerText = "አባል፦ " + u;
                    document.getElementById('member-section').style.display = 'block';
                }
            }
            async function createIddir() {
                const n = document.getElementById('id-name').value;
                const a = document.getElementById('id-admin').value;
                if(!n || !a) return;
                await fetch('/api/create', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({name: n, admin: a})
                });
                alert("🎉 እድር ተፈጠረ!");
                document.getElementById('list').innerHTML += "• " + n + " (አድሚን: " + a + ")<br>";
            }
        </script>
    </body>
    </html>
    `);
});

app.post('/api/create', (req, res) => {
    const { name, admin } = req.body;
    tempDB.iddirs[Date.now()] = { name, admin };
    res.json({ success: true });
});

app.listen(PORT, () => { console.log("Server running on port " + PORT); });
