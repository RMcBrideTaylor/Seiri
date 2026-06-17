import { defineRelations } from 'drizzle-orm'
import * as schema from './_schema'

export const relations = defineRelations(schema, (r) => ({
  files: {
    tags: r.many.tags({
      from: r.files.id.through(r.filesToTags.fileId),
      to: r.tags.id.through(r.filesToTags.tagId)
    }),
    project: r.many.projects({
      from: r.files.id.through(r.filesToProjects.fileId),
      to: r.projects.id.through(r.filesToProjects.projectId)
    })
  },
  tags: {
    files: r.many.files()
  },
  projects: {
    files: r.many.files()
  }
}))
