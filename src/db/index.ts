import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

// Supabaseの接続情報
const connectionString = process.env.DATABASE_URL!

// PostgreSQL接続を作成
const client = postgres(connectionString)

// Drizzle ORMインスタンスを作成
export const db = drizzle(client, { schema })