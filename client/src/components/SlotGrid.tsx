import React, { useState } from 'react';
import { ParkingLot, ParkingSlot } from '../types/parking';

interface Props {
  lot: ParkingLot;
}

export function SlotGrid({ lot }: Props) {
  // Group slots by floor
  const floors = Array.from(new Set(lot.slots.map(s => s.floor)));
  const [activeFloor, setActiveFloor] = useState(floors[0] || 'G');

  const activeSlots = lot.slots.filter(s => s.floor === activeFloor);
  
  // Organize active slots into a 2D grid
  // Rows are letters (A, B, C), Cols are numbers (1, 2, 3)
  const rows = Array.from(new Set(activeSlots.map(s => s.row))).sort();
  const cols = Array.from(new Set(activeSlots.map(s => s.col))).sort((a, b) => a - b);

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Floor Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {floors.map(floor => (
          <button
            key={floor}
            onClick={() => setActiveFloor(floor)}
            className={`
              px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all duration-200
              ${activeFloor === floor 
                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80'}
            `}
          >
            Floor {floor}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground bg-muted/30 p-3 rounded-xl border border-border/50">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-green-500/20 border border-green-500/50"></div>
          Available
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-red-500/20 border border-red-500/50"></div>
          Occupied
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-auto rounded-xl border border-border/50 bg-muted/10 p-4">
        <div className="inline-flex flex-col gap-3 min-w-full">
          {rows.map(row => (
            <div key={row} className="flex gap-3 items-center">
              <div className="w-6 text-center font-bold text-muted-foreground text-sm">
                {row}
              </div>
              <div className="flex gap-2">
                {cols.map(col => {
                  const slot = activeSlots.find(s => s.row === row && s.col === col);
                  if (!slot) return <div key={col} className="w-10 h-14 opacity-0" />;
                  
                  const isAvailable = slot.status === 'available';
                  
                  return (
                    <div
                      key={slot.id}
                      title={`Slot ${slot.id}`}
                      className={`
                        w-10 h-14 rounded-md flex items-center justify-center text-[10px] font-bold border-2
                        transition-colors duration-500 ease-in-out cursor-default
                        ${isAvailable 
                          ? 'bg-green-500/10 border-green-500/40 text-green-700 dark:text-green-400' 
                          : 'bg-red-500/10 border-red-500/40 text-red-700 dark:text-red-400'}
                      `}
                    >
                      <div className="flex flex-col items-center gap-1 opacity-60">
                        {isAvailable ? 'P' : <div className="w-4 h-6 bg-current rounded-[3px] opacity-80" />}
                        <span className="opacity-70">{col}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
