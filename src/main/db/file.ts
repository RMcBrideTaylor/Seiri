import { sql } from 'drizzle-orm'
import { sqliteTable, text, integer, check } from 'drizzle-orm/sqlite-core'

export const files = sqliteTable(
  'files',
  {
    id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
    path: text().notNull(),
    hash: text().notNull(),
    indexed: integer({ mode: 'timestamp' })
      .default(sql`(CURRENT_TIMESTAMP)`)
      .notNull(),
    rating: integer().default(0).notNull()
  },
  (table) => [check('rating_check', sql`0 < ${table.rating} < 6`)]
)
