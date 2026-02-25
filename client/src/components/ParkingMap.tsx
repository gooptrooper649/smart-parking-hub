import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import { useParking } from '../context/ParkingContext';
import { CreateParkingDialog } from './CreateParkingDialog';
import { ParkingLot } from '../types/parking';
import { MapPin, Navigation } from 'lucide-react';

// Custom icons using Lucide SVGs wrapped in Leaflet DivIcons
const createCustomIcon = (occupancy: number, isSelected: boolean) => {
  const colorClass = occupancy >= 80 ? 'bg-red-500' : occupancy >= 60 ? 'bg-yellow-500' : 'bg-green-500';
  const ringClass = isSelected ? 'ring-4 ring-primary ring-offset-2' : 'ring-2 ring-white/20';
  
  return L.divIcon({
    className: 'bg-transparent border-0',
    html: `
      <div class="relative flex items-center justify-center w-10 h-10 rounded-full shadow-lg ${colorClass} ${ringClass} transition-all duration-300 transform ${isSelected ? 'scale-110' : 'hover:scale-105'}">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
        <div class="absolute -top-2 -right-2 bg-background text-foreground text-xs font-bold px-1.5 py-0.5 rounded-md shadow-sm border border-border">
          ${Math.round(occupancy)}%
        </div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
  });
};

const userIcon = L.divIcon({
  className: 'bg-transparent border-0',
  html: `
    <div class="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 ring-4 ring-blue-500/30 shadow-xl animate-pulse">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m12 8-4 4 4 4"/><path d="M16 12H9"/></svg>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

// Component to handle map clicks
function MapEvents({ onRightClick }: { onRightClick: (coords: [number, number], e: L.LeafletMouseEvent) => void }) {
  useMapEvents({
    contextmenu(e) {
      onRightClick([e.latlng.lat, e.latlng.lng], e);
    }
  });
  return null;
}

export function ParkingMap() {
  const { parkingLots, selectedLot, userLocation, rerouteData, selectParkingLot } = useParking();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [clickCoords, setClickCoords] = useState<[number, number] | null>(null);
  
  // Custom context menu state
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, coords: [number, number] } | null>(null);

  const handleRightClick = (coords: [number, number], e: L.LeafletMouseEvent) => {
    // Prevent default browser context menu is handled by Leaflet's contextmenu event naturally
    setContextMenu({
      x: e.originalEvent.clientX,
      y: e.originalEvent.clientY,
      coords
    });
  };

  const closeContextMenu = () => setContextMenu(null);

  const getOccupancy = (lot: ParkingLot) => {
    const occupied = lot.slots.filter(s => s.status === 'occupied').length;
    return (occupied / lot.slots.length) * 100;
  };

  return (
    <div className="relative w-full h-full bg-slate-100" onClick={closeContextMenu}>
      <MapContainer 
        center={userLocation} 
        zoom={13} 
        className="w-full h-full z-0"
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        <ZoomControl position="bottomright" />
        <MapEvents onRightClick={handleRightClick} />

        {/* User Location Marker */}
        <Marker position={userLocation} icon={userIcon}>
          <Popup>Your Location</Popup>
        </Marker>

        {/* Parking Lot Markers */}
        {parkingLots.map(lot => {
          const occupancy = getOccupancy(lot);
          return (
            <Marker 
              key={lot.id} 
              position={[lot.lat, lot.lng]}
              icon={createCustomIcon(occupancy, selectedLot?.id === lot.id)}
              eventHandlers={{
                click: () => selectParkingLot(lot.id)
              }}
            >
              <Popup className="font-sans rounded-xl overflow-hidden">
                <div className="p-1 min-w-[150px]">
                  <h3 className="font-bold text-base mb-1">{lot.name}</h3>
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>Occupancy:</span>
                    <span className={`font-semibold ${occupancy >= 80 ? 'text-red-500' : occupancy >= 60 ? 'text-yellow-500' : 'text-green-500'}`}>
                      {Math.round(occupancy)}%
                    </span>
                  </div>
                  <button 
                    onClick={() => selectParkingLot(lot.id)}
                    className="w-full py-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-md font-medium text-sm transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Reroute Polyline */}
        {rerouteData && (
          <Polyline 
            positions={[
              [rerouteData.from.lat, rerouteData.from.lng],
              [rerouteData.to.lat, rerouteData.to.lng]
            ]}
            color="hsl(var(--primary))"
            weight={4}
            dashArray="10, 10"
            className="animate-pulse"
          />
        )}
      </MapContainer>

      {/* Custom Floating Context Menu */}
      {contextMenu && (
        <div 
          className="fixed z-50 bg-card border border-border/50 shadow-2xl rounded-xl overflow-hidden py-1 w-48 animate-in fade-in zoom-in-95 duration-150"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button 
            className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors flex items-center gap-2"
            onClick={(e) => {
              e.stopPropagation();
              setClickCoords(contextMenu.coords);
              setDialogOpen(true);
              closeContextMenu();
            }}
          >
            <MapPin className="w-4 h-4 text-primary" />
            Add Parking Here
          </button>
        </div>
      )}

      {/* Floating helper text */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 glass-panel px-6 py-3 rounded-full text-sm font-medium flex items-center gap-2 text-foreground/80 shadow-black/5">
        <Navigation className="w-4 h-4 text-primary" />
        Right-click anywhere on the map to add a new parking lot
      </div>

      <CreateParkingDialog 
        isOpen={dialogOpen} 
        onClose={() => setDialogOpen(false)} 
        coordinates={clickCoords} 
      />
    </div>
  );
}
