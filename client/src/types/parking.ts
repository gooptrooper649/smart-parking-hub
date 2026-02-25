export type SlotStatus = 'available' | 'occupied';

export interface ParkingSlot {
  id: string; // e.g., GA1, 1B2
  floor: string;
  row: string;
  col: number;
  status: SlotStatus;
}

export interface ParkingLot {
  id: string;
  name: string;
  lat: number;
  lng: number;
  levels: number;
  rowsPerLevel: number;
  colsPerLevel: number;
  slots: ParkingSlot[];
}

export interface RerouteData {
  from: ParkingLot;
  to: ParkingLot;
  distanceKm: number;
}
