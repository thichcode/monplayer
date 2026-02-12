const express = require("express");
const axios = require("axios");
const path = require("path");
const cors = require("cors");
const fs = require("fs");

const app = express();
const DEFAULT_PORT = process.env.PORT || 3000;
const baseDir = process.pkg ? path.dirname(process.execPath) : __dirname;
const configPath = path.join(baseDir, "config.json");

// Đọc config
let config = {
  port: DEFAULT_PORT,
  autoOpenBrowser: true,
  title: "MON Player - IPTV Player",
};

try {
  if (fs.existsSync(configPath)) {
    config = { ...config, ...JSON.parse(fs.readFileSync(configPath, "utf8")) };
  }
} catch (error) {
  console.log("Không thể đọc config.json, sử dụng giá trị mặc định");
}

const PORT = process.env.PORT || config.port || DEFAULT_PORT;

app.use(cors());
app.use(express.static(baseDir));
console.log(`Serving static files from: ${baseDir}`);

const axiosInstance = axios.create({
  timeout: 10000,
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  },
});

const MAX_REDIRECTS = 5;

const normalizeRedirectTarget = (location, currentUrl) => {
  if (!location) {
    throw new Error("Không tìm thấy header Redirect");
  }

  if (location.startsWith("monplayer://")) {
    const parsed = new URL(location);
    const link = parsed.searchParams.get("link");
    if (link) {
      return link;
    }
    throw new Error("Redirect monplayer không có tham số link");
  }

  return new URL(location, currentUrl).toString();
};

const fetchWithRedirects = async (url, attempt = 0, visited = new Set()) => {
  if (attempt >= MAX_REDIRECTS) {
    throw new Error("Quá nhiều lần chuyển hướng");
  }

  if (visited.has(url)) {
    throw new Error("Vòng lặp chuyển hướng được phát hiện");
  }
  visited.add(url);

  const response = await axiosInstance.get(url, {
    maxRedirects: 0,
    validateStatus: (status) => status < 400,
  });

  if (
    response.status >= 300 &&
    response.status < 400 &&
    response.headers.location
  ) {
    const nextUrl = normalizeRedirectTarget(response.headers.location, url);
    return fetchWithRedirects(nextUrl, attempt + 1, visited);
  }

  return response;
};

const handleProxyError = (res, source, error) => {
  let message = `Không thể tải ${source}`;

  if (axios.isAxiosError(error)) {
    if (error.code === "ECONNABORTED") {
      message = `${source} quá thời gian chờ`;
    } else if (error.response) {
      message = `${source} trả về lỗi ${error.response.status}`;
    }
  }

  console.error(`Error fetching ${source}:`, error.message);
  res.status(500).json({ error: message, detail: error.message });
};

app.get("/api/iptv", async (req, res) => {
  try {
    const url = req.query.url;
    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    const response = await fetchWithRedirects(url);
    res.json(response.data);
  } catch (error) {
    handleProxyError(res, "dữ liệu IPTV", error);
  }
});

app.get("/api/stream", async (req, res) => {
  try {
    const url = req.query.url;
    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    const response = await fetchWithRedirects(url);
    res.json(response.data);
  } catch (error) {
    handleProxyError(res, "stream", error);
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(baseDir, "index.html"));
});

app.listen(PORT, () => {
  console.log(`MON Player server running on http://localhost:${PORT}`);
  console.log("Open your browser and navigate to http://localhost:3000");
});
