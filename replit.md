# Smart Multi-Floor Parking & Rerouting System

A production-ready React application for managing smart parking locations with automatic rerouting functionality.

## Overview

This is a client-side single-page application (SPA) built with React, TypeScript, and Leaflet that enables users to:
- View an interactive map centered on their current location
- Add parking lots by right-clicking on the map
- Automatically generate multi-floor parking slot layouts
- View real-time parking occupancy statistics
- Get automatically rerouted to the nearest available parking when a selected lot is over 80% full

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **React Leaflet** for interactive maps with OpenStreetMap tiles
- **Shadcn UI** components for modern, accessible interface
- **Tailwind CSS** for responsive styling
- **LocalStorage** for persistent data (no backend required)
- **Wouter** for client-side routing

### Features Implemented
1. **Map Integration**: Leaflet.js with OpenStreetMap, auto-centered on user location
2. **Right-Click Parking Creation**: Custom context menu to add parking lots
3. **Dynamic Slot Generation**: Generates slots with format FloorRowCol (e.g., GA1, 1B2)
4. **Dashboard**: Real-time statistics with color-coded occupancy indicators
5. **Smart Rerouting**: Haversine formula implementation for nearest parking calculation
6. **LocalStorage Persistence**: All data saves automatically to browser storage

## Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── CreateParkingDialog.tsx   # Form to add new parking lots
│   │   ├── ParkingDashboard.tsx      # Sidebar with stats and slot grid
│   │   ├── ParkingMap.tsx            # Main map component with markers
│   │   └── SlotGrid.tsx              # Visual grid of parking slots
│   ├── context/
│   │   └── ParkingContext.tsx        # Global state management
│   ├── lib/
│   │   └── geo.ts                    # Haversine distance calculation
│   ├── types/
│   │   └── parking.ts                # TypeScript interfaces
│   └── pages/
│       └── Home.tsx                  # Main application page
shared/                               # Shared types (minimal, app is frontend-only)
server/                               # Minimal backend (not used by parking app)
```

## Data Model

### ParkingLot
```typescript
{
  id: string;
  name: string;
  lat: number;
  lng: number;
  levels: number;
  rowsPerLevel: number;
  colsPerLevel: number;
  slots: ParkingSlot[];
}
```

### Slot Naming Convention
- Ground floor: `G` + Row Letter + Column Number (e.g., `GA1`, `GB5`)
- Upper floors: Floor Number + Row Letter + Column Number (e.g., `1A1`, `2B3`)
- Rows: A, B, C... (sequential letters)
- 75% of slots are randomly marked as occupied on creation

## Key Features

### Smart Rerouting Logic
When a user selects a parking lot with over 80% occupancy:
1. System filters all parking lots with < 80% occupancy
2. Calculates distance using Haversine formula
3. Selects the nearest available parking
4. Draws a route polyline on the map
5. Shows a toast notification

### LocalStorage Structure
```javascript
localStorage.setItem('smart_parking_data', JSON.stringify(parkingLots));
```

## Deployment

This is a static SPA that can be deployed to:
- **Netlify** (recommended)
- **Vercel**
- **GitHub Pages**
- Any static hosting service

### Build Command
```bash
npm run build
```

### Deploy Directory
```
dist/
```

## Development

### Run Locally
```bash
npm run dev
```

### Environment
No environment variables or backend services required. The app runs entirely in the browser.

## User Preferences

- Clean, modern design with soft shadows and card-based layout
- Responsive: 70% map width, 30% dashboard on desktop; stacked on mobile
- Color-coded status indicators: Green (<60%), Yellow (60-80%), Red (>80%)
- Animated transitions for slot status changes
- Custom map markers with occupancy percentage badges

## Future Enhancements

If backend integration is needed:
- User authentication
- Save parking data to database
- Real-time updates via WebSocket
- Parking reservation system
- Mobile app with push notifications
