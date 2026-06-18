import { sql } from 'drizzle-orm'
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { files } from './file'

export const projects = sqliteTable('projects', {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: text(),
  created: integer({ mode: 'timestamp' }).default(sql`(CURRENT_TIMESTAMP)`)
})

export const filesToProjects = sqliteTable('projects_files', {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  projectId: integer('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  fileId: integer('file_id')
    .notNull()
    .references(() => files.id, { onDelete: 'cascade' })
})