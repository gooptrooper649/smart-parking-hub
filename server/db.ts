import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

// Since this is a static client-side only app deploying to Netlify,
// we do not require a database. We only initialize the pool to satisfy the dev server
// if it happens to be provided.
export const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : null;

export const db = pool ? drizzle(pool, { schema }) : (null as any);
