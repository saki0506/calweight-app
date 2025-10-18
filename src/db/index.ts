import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const connectionURL = process.env.DATABASE_URL

if (!connectionURL) {
  throw new Error('DATABASE_URL is not defined')
}

const client = postgres(connectionURL, {
  prepare: false,
})

export const db = drizzle(client, {
  schema,
  casing: 'snake_case'
})