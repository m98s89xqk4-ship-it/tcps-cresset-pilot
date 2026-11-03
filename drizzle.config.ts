import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

const databaseUrl = process.env.DATABASE_URL?.trim()

if (!databaseUrl) {
  throw new Error(
    'DATABASE_URL is required to run Drizzle commands. Add it to your environment or .env.local before generating or applying migrations.',
  )
}

export default defineConfig({
  schema: './lib/server/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: databaseUrl,
  },
  strict: true,
})
