# 🛒 Amazon Product Scraper - Frontend (Vite)

This frontend consumes the `/api/scrape` endpoint from the backend and displays:

- **Title**
- **Rating** (0–5 stars)
- **Number of reviews**
- **Image URL**

Built with **Vite**, HTML, CSS, and JavaScript.

---

## 📂 Project Structure (Frontend)

frontend/
├── src/
│ ├── main.js # Fetches API data and updates UI
│ └── style.css # Page styling
├── vite.config.js # Proxy configuration to backend
└── README.md

---

## 🔗 API Connection

The frontend expects the backend to run on **http://localhost:3000**.  
This is handled by `vite.config.js` via proxy settings.

If the backend runs on another host/port, update:
`vite.config.js`

---

## 🚀 Running the Frontend

### 1️⃣ Install dependencies

"bun install"

### 2️⃣ Start the development server

"bun dev"

The frontend will be available at:

**http://localhost:5173**