module.exports = {
  apps: [{
    name: "devops-monitoring-dashboard",
    script: "app.js",
    cwd: "/home/ubuntu/devops-infrastructure-monitoring-dashboard",
    instances: 1,
    exec_mode: "fork",
    autorestart: true,
    watch: false,
    max_memory_restart: "300M",
    env: {
      NODE_ENV: "production",
      PORT: 3100,
      HOST: "127.0.0.1"
    }
  }]
};
