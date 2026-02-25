# Smart Multi-Floor Parking & Rerouting System

A production-ready React application for managing smart parking locations with automatic rerouting functionality. This application runs entirely in the browser and uses LocalStorage for data persistence, making it perfect for static hosting.

## 🚀 Features

- **Interactive Map**: Built with Leaflet.js and OpenStreetMap.
- **Dynamic Parking Creation**: Right-click on the map to add new parking locations.
- **Multi-Floor Support**: Automatically generates slots for Ground (G) and upper floors.
- **Real-time Occupancy Dashboard**: Visual grid and statistics for each parking lot.
- **Smart Rerouting**: Uses the Haversine formula to find the nearest available parking when a lot is >80% full.
- **Persistence**: All data is saved to your browser's LocalStorage.

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS & Shadcn UI
- **Map**: React Leaflet
- **Icons**: Lucide React
- **Routing**: Wouter

## 📦 Requirements

- Node.js 20.x or later
- npm 10.x or later

## 🚀 Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

## 🌐 Deployment (Netlify / Static Hosting)

This project is designed to be deployed as a static site.

1. Run `npm run build`.
2. Deploy the contents of the `dist` directory.
3. Ensure your hosting provider is configured to serve `index.html` for all routes (Single Page Application support).

### Netlify `_redirects` file (optional but recommended):
Create a file named `public/_redirects` with:
```text
/*    /index.html   200
```

## 📝 License

MIT
