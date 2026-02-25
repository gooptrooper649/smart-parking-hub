import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ParkingLot, ParkingSlot, RerouteData } from '../types/parking';
import { calculateHaversineDistance } from '../lib/geo';
import { useToast } from '../hooks/use-toast';

interface ParkingContextType {
  parkingLots: ParkingLot[];
  selectedLot: ParkingLot | null;
  userLocation: [number, number];
  rerouteData: RerouteData | null;
  addParkingLot: (lot: Omit<ParkingLot, 'id' | 'slots'>) => void;
  selectParkingLot: (id: string) => void;
  refreshOccupancy: (id: string) => void;
  clearReroute: () => void;
}

const ParkingContext = createContext<ParkingContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'smart_parking_data';
const DEFAULT_USER_LOCATION: [number, number] = [40.7128, -74.0060]; // NYC default

export function ParkingProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [parkingLots, setParkingLots] = useState<ParkingLot[]>([]);
  const [selectedLotId, setSelectedLotId] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number]>(DEFAULT_USER_LOCATION);
  const [rerouteData, setRerouteData] = useState<RerouteData | null>(null);

  // Load from local storage on mount
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        setParkingLots(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse stored parking data");
      }
    }

    // Try to get actual user location
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.warn("Geolocation denied or error, using default location.");
        }
      );
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parkingLots));
  }, [parkingLots]);

  const generateSlots = (levels: number, rows: number, cols: number): ParkingSlot[] => {
    const slots: ParkingSlot[] = [];
    for (let l = 0; l < levels; l++) {
      const floor = l === 0 ? 'G' : String(l);
      for (let r = 0; r < rows; r++) {
        const rowChar = String.fromCharCode(65 + r); // A, B, C...
        for (let c = 1; c <= cols; c++) {
          slots.push({
            id: `${floor}${rowChar}${c}`,
            floor,
            row: rowChar,
            col: c,
            status: Math.random() > 0.25 ? 'occupied' : 'available' // 75% chance occupied
          });
        }
      }
    }
    return slots;
  };

  const addParkingLot = (lotData: Omit<ParkingLot, 'id' | 'slots'>) => {
    const newLot: ParkingLot = {
      ...lotData,
      id: uuidv4(),
      slots: generateSlots(lotData.levels, lotData.rowsPerLevel, lotData.colsPerLevel)
    };
    setParkingLots(prev => [...prev, newLot]);
    toast({
      title: "Parking Lot Created",
      description: `${newLot.name} has been added to the map.`,
    });
  };

  const getOccupancyPercentage = (lot: ParkingLot): number => {
    const occupied = lot.slots.filter(s => s.status === 'occupied').length;
    return (occupied / lot.slots.length) * 100;
  };

  const selectParkingLot = (id: string) => {
    const lot = parkingLots.find(p => p.id === id);
    if (!lot) return;

    setSelectedLotId(id);
    setRerouteData(null); // Clear previous reroute

    const occupancy = getOccupancyPercentage(lot);
    
    // Smart Rerouting Logic
    if (occupancy > 80) {
      toast({
        title: "Selected Parking is Full",
        description: "Checking for nearest available alternatives...",
        variant: "destructive",
      });

      // Find nearest parking with < 80% occupancy
      let nearestLot: ParkingLot | null = null;
      let minDistance = Infinity;

      parkingLots.forEach(otherLot => {
        if (otherLot.id === lot.id) return;
        
        const otherOccupancy = getOccupancyPercentage(otherLot);
        if (otherOccupancy < 80) {
          const dist = calculateHaversineDistance(lot.lat, lot.lng, otherLot.lat, otherLot.lng);
          if (dist < minDistance) {
            minDistance = dist;
            nearestLot = otherLot;
          }
        }
      });

      if (nearestLot) {
        setRerouteData({
          from: lot,
          to: nearestLot,
          distanceKm: minDistance
        });
        
        // Auto-select the new recommended lot
        setSelectedLotId(nearestLot.id);

        setTimeout(() => {
          toast({
            title: "Rerouted!",
            description: `Directed to ${nearestLot.name} (${minDistance.toFixed(2)}km away)`,
            className: "bg-green-600 text-white border-none",
          });
        }, 1000);
      } else {
        setTimeout(() => {
          toast({
            title: "No Alternatives Found",
            description: "All nearby parking lots are currently full.",
            variant: "destructive",
          });
        }, 1000);
      }
    }
  };

  const refreshOccupancy = (id: string) => {
    setParkingLots(prev => prev.map(lot => {
      if (lot.id !== id) return lot;
      return {
        ...lot,
        slots: lot.slots.map(slot => ({
          ...slot,
          status: Math.random() > 0.25 ? 'occupied' : 'available'
        }))
      };
    }));
    toast({
      title: "Occupancy Refreshed",
      description: "Slot statuses have been updated.",
    });
  };

  const clearReroute = () => {
    setRerouteData(null);
  };

  const selectedLot = parkingLots.find(p => p.id === selectedLotId) || null;

  return (
    <ParkingContext.Provider value={{
      parkingLots,
      selectedLot,
      userLocation,
      rerouteData,
      addParkingLot,
      selectParkingLot,
      refreshOccupancy,
      clearReroute
    }}>
      {children}
    </ParkingContext.Provider>
  );
}

export function useParking() {
  const context = useContext(ParkingContext);
  if (context === undefined) {
    throw new Error('useParking must be used within a ParkingProvider');
  }
  return context;
}
