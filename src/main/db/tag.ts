import { sql } from 'drizzle-orm'
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { files } from './file'

export const tags = sqliteTable('tags', {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  created: integer({ mode: 'timestamp' })
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull()
})

export const filesToTags = sqliteTable('tags_files', {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  tagId: integer('tag_id')
    .notNull()
    .references(() => tags.id, { onDelete: 'cascade' }),
  fileId: integer('file_id')
    .notNull()
    .references(() => files.id, { onDelete: 'cascade' })
})
