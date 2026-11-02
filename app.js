const express = require("express");
const os = require("os");
const path = require("path");
const si = require("systeminformation");

const app = express();
const PORT = Number(process.env.PORT || 3100);
const HOST = process.env.HOST || "127.0.0.1";
const startedAt = Date.now();

app.disable("x-powered-by");
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "devops-monitoring-dashboard",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime())
  });
});

app.get("/api/metrics", async (req, res) => {
  try {
    const [load, mem, fs, osInfo, time, cpu] = await Promise.all([
      si.currentLoad(),
      si.mem(),
      si.fsSize(),
      si.osInfo(),
      si.time(),
      si.cpu()
    ]);

    const rootDisk = fs.find(d => d.mount === "/") || fs[0] || {};
    const totalMem = mem.total || 0;
    const usedMem = mem.used || 0;

    res.json({
      timestamp: new Date().toISOString(),
      hostname: os.hostname(),
      platform: osInfo.distro || osInfo.platform || os.platform(),
      release: osInfo.release || os.release(),
      architecture: os.arch(),
      cpu: {
        model: cpu.brand || "Unknown CPU",
        cores: cpu.cores || os.cpus().length,
        usagePercent: Number((load.currentLoad || 0).toFixed(1))
      },
      memory: {
        totalBytes: totalMem,
        usedBytes: usedMem,
        freeBytes: mem.available || mem.free || 0,
        usagePercent: totalMem ? Number((usedMem / totalMem * 100).toFixed(1)) : 0
      },
      disk: {
        mount: rootDisk.mount || "/",
        totalBytes: rootDisk.size || 0,
        usedBytes: rootDisk.used || 0,
        usagePercent: Number((rootDisk.use || 0).toFixed(1))
      },
      uptimeSeconds: time.uptime || os.uptime(),
      appUptimeSeconds: Math.floor((Date.now() - startedAt) / 1000)
    });
  } catch (error) {
    console.error("Metrics collection failed:", error);
    res.status(500).json({ error: "Unable to collect system metrics" });
  }
});

app.get("/api/deployment", (req, res) => {
  res.json({
    application: "DevOps Infrastructure Monitoring Dashboard",
    version: process.env.APP_VERSION || "1.0.0",
    deployedAt: process.env.DEPLOYED_AT || "Local deployment",
    environment: process.env.NODE_ENV || "production"
  });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, HOST, () => {
  console.log(`Dashboard listening on http://${HOST}:${PORT}`);
});
