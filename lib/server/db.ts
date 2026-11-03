import 'server-only'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from '@/lib/server/schema'

declare global {
  var tcpsCressetPool: Pool | undefined
}

function getDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL?.trim()

  if (!databaseUrl) {
    throw new Error(
      'DATABASE_URL is missing. Set DATABASE_URL in the server environment before using the PostgreSQL persistence layer.',
    )
  }

  return databaseUrl
}

function getPool() {
  if (!global.tcpsCressetPool) {
    global.tcpsCressetPool = new Pool({
      connectionString: getDatabaseUrl(),
    })
  }

  return global.tcpsCressetPool
}

export function getDb() {
  return drizzle(getPool(), { schema })
}
