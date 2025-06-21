# 🌍 Disaster Response Platform

A full-stack, open-source disaster response and crisis coordination app. It aggregates real-time data including social media reports, verified images, geospatial resources, and official updates to help communities respond to disasters efficiently.

---

## 🚀 Live Features

- 🧭 **Disaster Management Dashboard**
  - Create, update, delete, and view disasters
  - Tag by type (e.g., flood, earthquake)

- 📍 **Location Extraction + Geocoding**
  - Uses Google Gemini and OpenStreetMap to convert text-based locations to lat/lng

- 🐦 **Real-time Social Media Feed**
  - Streams live or mock Twitter/Bluesky posts for disaster-specific hashtags

- 🧠 **Image Verification**
  - Uses Google Gemini 1.5 to analyze uploaded disaster images for authenticity

- 🧾 **User Reports**
  - Users can submit reports with image URLs and auto-verification

- 🏥 **Geospatial Resources**
  - Map shelters, food centers, relief points by disaster with lat/lng

- 📡 **WebSocket Live Updates**
  - All disaster/resource/report changes are real-time

---

## 🛠️ Tech Stack

| Layer       | Tech Used                  |
|-------------|----------------------------|
| Frontend    | React + Tailwind CSS       |
| Backend     | Node.js + Express.js       |
| Realtime    | Socket.IO                  |
| Database    | Supabase (PostgreSQL + GIS)|
| AI Services | Google Gemini 1.5 API      |
| Maps        | OpenStreetMap (Nominatim)  |
| Hosting     | Localhost / Render / Vercel|

---

## 📦 Installation & Setup

```bash
# 1. Clone the repo
git clone https://github.com/your-username/disaster-response-platform
cd disaster-response-platform

# 2. Setup backend
cd backend
npm install
# Add your Supabase URL & key and Gemini API key to .env
npm run dev

# 3. Setup frontend
cd ../frontend
npm install
npm start
