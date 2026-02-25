import { type Dummy, type InsertDummy } from "@shared/schema";

export interface IStorage {
  getDummies(): Promise<Dummy[]>;
}

export class MemStorage implements IStorage {
  async getDummies(): Promise<Dummy[]> {
    return [];
  }
}

export const storage = new MemStorage();
