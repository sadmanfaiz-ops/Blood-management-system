# Frontend (Demo)

This folder contains a simple static demo frontend to test the backend API locally.

Files:
- `index.html` — demo UI that checks backend `/health` and performs donor search by zone.
- `css/style.css` — refined styles (navbar, hero, cards, responsive)
- `js/app.js` — fetch calls for health check and zone-based search
- `FIGMA_ASSETS_GUIDE.md` — **How to export images from Figma and integrate them** ⭐

How to serve locally

Option A — Python (no Node required):
```powershell
cd C:\Users\USER\Downloads\Blood-management-system\frontend; python -m http.server 3000
# Open: http://localhost:3000
```

Option B — Node (http-server):
```powershell
cd C:\Users\USER\Downloads\Blood-management-system\frontend; npx http-server -p 3000
# Open: http://localhost:3000
```

Notes
- The demo assumes backend runs at `http://localhost:8000`. If your backend runs elsewhere, edit `js/app.js` and change the `BACKEND` constant.
- If you get CORS errors, ensure backend CORS allows `http://localhost:3000` (see backend settings) and restart backend.
- This frontend uses **zone/district search** (Bangladesh) instead of coordinates. Backend endpoint: `/api/donors/search?blood_group=O%2B&zone=Dhaka`
- **To add images from your Figma template**, see `FIGMA_ASSETS_GUIDE.md` for step-by-step instructions.
