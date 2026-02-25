import React from 'react';
import { ParkingMap } from '../components/ParkingMap';
import { ParkingDashboard } from '../components/ParkingDashboard';

export default function Home() {
  return (
    <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden bg-background">
      {/* Main Map Area - takes up remaining space */}
      <main className="flex-1 relative h-[60vh] md:h-full z-0 order-2 md:order-1">
        <ParkingMap />
      </main>

      {/* Sidebar Dashboard - 30% width on desktop */}
      <aside className="w-full md:w-[380px] lg:w-[420px] h-[40vh] md:h-full shrink-0 shadow-[-10px_0_30px_rgba(0,0,0,0.05)] z-10 order-1 md:order-2 flex flex-col">
        <ParkingDashboard />
      </aside>
    </div>
  );
}
