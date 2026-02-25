import { pgTable, text, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Dummy table to satisfy the build environment requirements.
// The application will strictly use LocalStorage for data persistence as requested.
export const dummy = pgTable("dummy", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

export const insertDummySchema = createInsertSchema(dummy).omit({ id: true });
export type Dummy = typeof dummy.$inferSelect;
export type InsertDummy = z.infer<typeof insertDummySchema>;
