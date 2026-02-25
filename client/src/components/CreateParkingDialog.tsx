import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useParking } from '../context/ParkingContext';

const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  levels: z.coerce.number().min(1).max(10),
  rowsPerLevel: z.coerce.number().min(1).max(26), // A-Z
  colsPerLevel: z.coerce.number().min(1).max(50),
});

type FormValues = z.infer<typeof formSchema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  coordinates: [number, number] | null;
}

export function CreateParkingDialog({ isOpen, onClose, coordinates }: Props) {
  const { addParkingLot } = useParking();
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      levels: 2,
      rowsPerLevel: 4,
      colsPerLevel: 10,
    }
  });

  const onSubmit = (data: FormValues) => {
    if (!coordinates) return;
    
    addParkingLot({
      name: data.name,
      lat: coordinates[0],
      lng: coordinates[1],
      levels: data.levels,
      rowsPerLevel: data.rowsPerLevel,
      colsPerLevel: data.colsPerLevel,
    });
    
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display">Add Parking Lot</DialogTitle>
          <DialogDescription>
            Configure a new multi-floor parking structure at the selected location.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Parking Name</Label>
            <Input 
              id="name" 
              placeholder="e.g. Downtown Central Garage" 
              {...register('name')}
              className="h-12 rounded-xl"
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="levels">Levels (Floors)</Label>
              <Input 
                id="levels" 
                type="number" 
                {...register('levels')}
                className="h-12 rounded-xl"
              />
              {errors.levels && <p className="text-sm text-destructive">{errors.levels.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rowsPerLevel">Rows/Level</Label>
              <Input 
                id="rowsPerLevel" 
                type="number" 
                {...register('rowsPerLevel')}
                className="h-12 rounded-xl"
              />
              {errors.rowsPerLevel && <p className="text-sm text-destructive">{errors.rowsPerLevel.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="colsPerLevel">Cols/Level</Label>
              <Input 
                id="colsPerLevel" 
                type="number" 
                {...register('colsPerLevel')}
                className="h-12 rounded-xl"
              />
              {errors.colsPerLevel && <p className="text-sm text-destructive">{errors.colsPerLevel.message}</p>}
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} className="rounded-xl px-6">
              Cancel
            </Button>
            <Button type="submit" className="rounded-xl px-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25">
              Generate Parking
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
