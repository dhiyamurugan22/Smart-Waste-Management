# ♻️ Smart Waste Management System (BinFlow Tracker)

A modern, real-time IoT Smart Waste Management web application built with **React**, **Leaflet Maps**, and **Google Firebase (Cloud Firestore)**.

---

## 🚀 How to Run the Website (Single Command)

From this folder, run:

```bash
npm run dev
```

Then open your browser at **`http://localhost:5173`**. That's all!

---

## 🗄️ Database Setup (Firebase Cloud Firestore)

You don't need to install or run any local databases. The website connects directly to **Google Cloud Firestore**:

1. Open the website at `http://localhost:5173`.
2. In the top navbar, click **`⚡ Connect DB`**.
3. Paste your Firebase Web configuration from the [Firebase Console](https://console.firebase.google.com/) and click **"Save & Connect Live"**.
4. The website will automatically:
   - Connect live to your Firestore database.
   - Automatically seed initial sample bins and dispatch tasks.
   - Update in real-time across all browser windows when bins are emptied or simulated.

---

## ✨ Features

- 🗺️ **Interactive Leaflet IoT Map**: Live GPS color-coded markers for waste bins (CartoDB tiles, 100% free with no API keys needed).
- 📊 **Real-time IoT Telemetry**: Simulates sensor readings (fill level %, temperature °C, battery %).
- 🚛 **Driver Dispatch Portal**: Assign, track, and complete collection routes.
- 📈 **Environmental Analytics**: Live CO₂ offset, trees saved equivalent, and efficiency rating calculations.
- ⚡ **Offline Demo Mode**: Works seamlessly right out of the box even before connecting Firebase.