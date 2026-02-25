import React from 'react';
import { useParking } from '../context/ParkingContext';
import { SlotGrid } from './SlotGrid';
import { Button } from '@/components/ui/button';
import { RefreshCw, RouteOff, Car, AlertTriangle, ArrowRight } from 'lucide-react';

export function ParkingDashboard() {
  const { selectedLot, rerouteData, refreshOccupancy, clearReroute, selectParkingLot } = useParking();

  if (!selectedLot) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground p-8 text-center bg-card">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6 shadow-inner">
          <Car className="w-10 h-10 text-muted-foreground/50" />
        </div>
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">No Parking Selected</h2>
        <p className="max-w-[250px]">
          Select a parking lot on the map to view its real-time occupancy and slot details.
        </p>
      </div>
    );
  }

  const totalSlots = selectedLot.slots.length;
  const occupiedSlots = selectedLot.slots.filter(s => s.status === 'occupied').length;
  const availableSlots = totalSlots - occupiedSlots;
  const occupancyPercentage = (occupiedSlots / totalSlots) * 100;

  let statusColor = "text-green-500";
  let statusBg = "bg-green-500/10 border-green-500/20";
  let statusText = "Available";

  if (occupancyPercentage >= 80) {
    statusColor = "text-red-500";
    statusBg = "bg-red-500/10 border-red-500/20";
    statusText = "Almost Full";
  } else if (occupancyPercentage >= 60) {
    statusColor = "text-yellow-500";
    statusBg = "bg-yellow-500/10 border-yellow-500/20";
    statusText = "Filling Up";
  }

  return (
    <div className="w-full h-full flex flex-col bg-card border-l border-border/50 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border/50 bg-card/50 backdrop-blur-sm z-10">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-display font-bold leading-tight pr-4">{selectedLot.name}</h2>
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusBg} ${statusColor} whitespace-nowrap`}>
            {statusText}
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-muted/40 rounded-xl p-3 border border-border/50">
            <div className="text-xs text-muted-foreground mb-1">Total</div>
            <div className="text-xl font-bold">{totalSlots}</div>
          </div>
          <div className="bg-muted/40 rounded-xl p-3 border border-border/50">
            <div className="text-xs text-muted-foreground mb-1">Available</div>
            <div className="text-xl font-bold text-green-500">{availableSlots}</div>
          </div>
          <div className="bg-muted/40 rounded-xl p-3 border border-border/50">
            <div className="text-xs text-muted-foreground mb-1">Occupied</div>
            <div className="text-xl font-bold text-red-500">{Math.round(occupancyPercentage)}%</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 rounded-xl h-10 gap-2 border-border/60 hover:bg-muted"
            onClick={() => refreshOccupancy(selectedLot.id)}
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          {rerouteData && (
            <Button 
              variant="destructive" 
              size="sm" 
              className="flex-1 rounded-xl h-10 gap-2"
              onClick={clearReroute}
            >
              <RouteOff className="w-4 h-4" />
              Clear Route
            </Button>
          )}
        </div>
      </div>

      {/* Reroute Warning Banner */}
      {rerouteData && (
        <div className="bg-amber-500/10 border-y border-amber-500/20 p-4 shrink-0">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-amber-600 dark:text-amber-500">Reroute Active</h4>
              <p className="text-xs text-amber-600/80 dark:text-amber-500/80 mt-1 mb-2">
                Original destination was full. Showing route to alternative parking.
              </p>
              <div className="flex items-center gap-2 text-xs font-medium bg-amber-500/10 rounded-md p-2 border border-amber-500/20">
                <span className="truncate max-w-[100px] text-muted-foreground">{rerouteData.from.name}</span>
                <ArrowRight className="w-3 h-3 text-amber-500 shrink-0" />
                <button 
                  onClick={() => selectParkingLot(rerouteData.to.id)}
                  className="truncate text-amber-600 hover:underline"
                >
                  {rerouteData.to.name}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Slot Grid View */}
      <div className="flex-1 p-6 overflow-hidden">
        <h3 className="text-lg font-bold mb-4 font-display">Live Slot Grid</h3>
        <SlotGrid lot={selectedLot} />
      </div>
    </div>
  );
}
