# DevOps Infrastructure Monitoring Dashboard

A live Ubuntu laptop monitoring dashboard built with Node.js, Express, systeminformation, PM2, Nginx, Jenkins and Cloudflare Tunnel. Docker is not used.

## Features
- Live CPU load, RAM usage and root disk usage
- Hostname, Ubuntu release, CPU model, architecture and uptime
- API health endpoint at `/api/health`
- Deployment information endpoint at `/api/deployment`
- Auto-refreshing browser dashboard with charts

## Local development
```bash
npm ci
npm start
```
Open `http://127.0.0.1:3100`.

## Production on Ubuntu
Run the app with PM2 using `ecosystem.config.js`. Nginx listens on port 8088 and proxies to `127.0.0.1:3100`.

## Jenkins
The Jenkins pipeline checks out this repository, runs `npm ci` and `npm test`, then invokes the restricted deployment helper. Install the helper at `/usr/local/bin/deploy-monitoring-dashboard` and configure a narrow sudoers rule for that exact command. The Jenkins agent must have Node.js/npm available for the validation stage.

## Cloudflare
Point a Cloudflare Tunnel to `http://localhost:8088`. Do not expose Jenkins or other admin interfaces through the tunnel.

## Jenkins deployment note
The Jenkins pipeline only invokes the deployment helper. The helper performs dependency installation, syntax validation and PM2 reload as the Ubuntu login user, so Jenkins itself does not need Node.js installed. Update the Ubuntu account/path in the helper and PM2 ecosystem file if your Linux username is not `ubuntu`.
