# Realtime Chat (web ↔ Android)

A lightweight Socket.IO chat you can open in any browser (desktop or Android). Share a room code to connect devices and chat instantly.

## Run locally
1) Install dependencies
```
npm install
```
2) Start server
```
npm run start
```
3) Open the site
```
http://localhost:3000
```

On Android, open the same URL (ensure both devices are on the same network, or deploy the server and use its public URL).

## Dev mode
```
npm run dev
```

## How it works
- Express serves the static client from `public/`.
- Socket.IO handles real-time messaging. Users join a room code; all messages in that room are broadcast to connected clients.

## Deploy quick tip
- You can run this on any Node-friendly host or a small VPS. Expose port 3000 (or set `PORT`). Use a reverse proxy (e.g., nginx) with HTTPS for production.

## Deploy to Render (free tier)
1) Push this repo to GitHub.
2) In Render, create a **Web Service**:
   - Branch: main (or your branch)
   - Build command: `npm install`
   - Start command: `node server.js`
   - Environment: Node
   - No static site needed; Express serves `public/`.
3) Deploy. Render sets `PORT` automatically and gives you an HTTPS URL. Open that URL on Android/desktop, pick a room code, and chat.
