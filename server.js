const express = require('express');
const axios = require('axios');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Đọc config
let config = { port: PORT, autoOpenBrowser: true, title: "MON Player - IPTV Player" };
try {
    if (fs.existsSync(path.join(__dirname, 'config.json'))) {
        config = { ...config, ...JSON.parse(fs.readFileSync('config.json', 'utf8')) };
    }
} catch (error) {
    console.log('Không thể đọc config.json, sử dụng giá trị mặc định');
}

app.use(cors());
// Serve static files - cần xử lý cả khi chạy từ exe
let pathToServe;
if (process.pkg) {
    // Khi chạy từ exe, __dirname là temp folder
    pathToServe = path.join(process.cwd());
    console.log('Running from exe, serving static files from:', pathToServe);
} else {
    // Khi chạy từ node, __dirname là thư mục hiện tại
    pathToServe = path.join(__dirname);
    console.log('Running from node, serving static files from:', pathToServe);
}
app.use(express.static(pathToServe));

app.get('/api/iptv', async (req, res) => {
    try {
        const url = req.query.url;
        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error fetching IPTV data:', error);
        res.status(500).json({ error: 'Failed to fetch IPTV data' });
    }
});

app.get('/api/stream', async (req, res) => {
    try {
        const url = req.query.url;
        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error fetching stream data:', error);
        res.status(500).json({ error: 'Failed to fetch stream data' });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`MON Player server running on http://localhost:${PORT}`);
    console.log('Open your browser and navigate to http://localhost:3000');
});