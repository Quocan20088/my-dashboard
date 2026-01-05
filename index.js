const express = require('express');
const app = express();
const path = require('path');

// Render sẽ tự động cấp PORT, nếu không có thì dùng 3000
const PORT = process.env.PORT || 3000; 

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Dashboard Của Thịnh</title>
            <meta charset="UTF-8">
            <style>
                body { background-color: #0b0b0b; color: white; font-family: 'Segoe UI', sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
                .card { background: #161616; padding: 30px; border-radius: 20px; border: 1px solid #333; text-align: center; width: 350px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
                .user-info { display: flex; align-items: center; gap: 15px; margin-bottom: 20px; text-align: left; }
                .avatar { width: 50px; height: 50px; background: #4facfe; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-weight: bold; }
                .badge { background: #ffd700; color: black; font-size: 10px; padding: 2px 8px; border-radius: 5px; font-weight: bold; }
                .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 20px; }
                .stat-box { background: #222; padding: 15px; border-radius: 12px; border: 1px solid #333; }
                .stat-label { font-size: 10px; color: #888; text-transform: uppercase; margin-bottom: 5px; }
                .stat-value { font-size: 18px; font-weight: bold; color: #4facfe; }
                .status { margin-top: 20px; font-size: 12px; color: #00ff00; background: rgba(0,255,0,0.1); padding: 8px; border-radius: 8px; }
            </style>
        </head>
        <body>
            <div class="card">
                <div class="user-info">
                    <div class="avatar">T</div>
                    <div>
                        <div style="font-weight: bold;">thinh_0107</div>
                        <div class="badge">MEMBER</div>
                    </div>
                </div>
                <div class="stats-grid">
                    <div class="stat-box">
                        <div class="stat-label">Số dư (Credits)</div>
                        <div class="stat-value" style="color: #ffd700;">1,000,000</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-label">Bot Slots</div>
                        <div class="stat-value">0 / 1</div>
                    </div>
                </div>
                <div class="status">● HỆ THỐNG ĐANG HOẠT ĐỘNG TRÊN RENDER</div>
            </div>
        </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
});
