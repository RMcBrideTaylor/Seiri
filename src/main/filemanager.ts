import { BetterSQLite3Database, drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import { eq, like, and } from 'drizzle-orm'

import { files } from './db/file'
import { filesToTags, tags } from './db/tag'

import { access, constants, createReadStream } from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { glob } from 'node:fs/promises'

import { relations } from './db/relations'

export class FileManager {
  private static instance: FileManager | null = null
  private db: BetterSQLite3Database | null = null
  private directory: string | null = null

  public static getInstance(): FileManager {
    if (!FileManager.instance) {
      FileManager.instance = new FileManager()
    }
    return FileManager.instance
  }

  createCollection(dest: string[]): void {
    const location = dest[0] + '/' + dest[1] + '.scol'
    // Create sqlite file
    new Database(location, { verbose: console.log })

    // Load sqlite file onto the active connection
    this.db = drizzle(location, { relations: relations })
    this.directory = dest[0]

    // Trigger initial migrations in the background
    console.log('Running migrations')
    try {
      migrate(this.db, { migrationsFolder: './migrations' })
      console.log('😊 Migration complete!')
    } catch (error) {
      console.error('😔 Migration failed!', error)
      process.exit(1)
    }
  }

  loadCollection(dest: string): void {
    this.db = drizzle(dest, { relations: relations })
    this.directory = path.dirname(dest)
  }

  async addTag(id: number, tag: string): Promise<Tag> {
    if (this.db == null || this.directory == null) {
      process.exit(1)
    }

    // Check if tag already exists
    let t = await this.db.select().from(tags).where(eq(tags.name, tag))
    if (t.length == 0) {
      // If not create it

      t = await this.db
        .insert(tags)
        .values({
          name: tag
        })
        .returning()
    }

    if (
      (
        await this.db
          .select()
          .from(filesToTags)
          .where(and(eq(filesToTags.fileId, id), eq(filesToTags.tagId, t[0].id)))
      ).length == 0
    ) {
      // Associate it with the file by id
      await this.db.insert(filesToTags).values({
        fileId: id,
        tagId: t[0].id
      })
    }

    return t[0]
  }

  async batchTag(selected: number[], tag: string): Promise<void> {
    for (const selection of selected) {
      this.addTag(selection, tag)
    }
  }

  async removeTag(id: number, tagId: number): Promise<void> {
    if (this.db == null || this.directory == null) {
      process.exit(1)
    }

    await this.db
      .delete(filesToTags)
      .where(and(eq(filesToTags.fileId, id), eq(filesToTags.tagId, tagId)))

    return
  }

  async getFile(id): Promise<File> {
    if (this.db == null || this.directory == null) {
      process.exit(1)
    }

    // @ts-ignore 'This is actually correct, I need to figure out why it's not detecting it'
    const res = await this.db.query.files.findMany({
      where: {
        id: id
      },
      with: {
        tags: true
      }
    })

    return res.map((i) => {
      return {
        ...i,
        path: this.directory + '/' + i.path
      }
    })[0]
  }

  async indexFiles(): Promise<void> {
    if (this.db == null || this.directory == null) {
      process.exit(1)
    }

    // Recursively get a list of every file in the subdirectory that is an approved image type
    for await (const file of await glob([
      this.directory + '/**/*.webp',
      this.directory + '/**/*.gif',
      this.directory + '/**/*.jpeg',
      this.directory + '/**/*.jpg',
      this.directory + '/**/*.png',
      this.directory + '/**/*.svg'
    ])) {
      // Check if a file with the same hash and path combo exists
      const hash = await this.fileHash(file)
      const matches = await this.db
        .select()
        .from(files)
        .where(and(eq(files.hash, hash), like(files.path, '%' + path.basename(file) + '%')))

      if (matches.length < 1) {
        await this.db.insert(files).values({
          path: path.relative(this.directory, file),
          hash: hash
        })
      }

      // @TODO - Clear out any files that no longer exist in the index
      this.clearDeletedFiles()
    }

    return
  }

  async clearDeletedFiles(): Promise<void> {
    if (this.db == null || this.directory == null) {
      process.exit(1)
    }

    const records = await this.db.select().from(files)

    for (const record of records) {
      access(this.directory + '/' + record.path, constants.F_OK, async (err) => {
        if (err && this.db) {
          await this.db.delete(files).where(eq(files.id, record.id))
        }
      })
    }
  }

  async listFiles(): Promise<File[]> {
    if (!this.directory || !this.db) process.exit(1)

    // @ts-ignore 'This is actually correct, I need to figure out why it's not detecting it'
    const res = await this.db.query.files.findMany({
      with: {
        tags: true
      }
    })

    return res.map((i) => {
      return {
        ...i,
        path: this.directory + '/' + i.path
      }
    })
  }

  async rateFile(rate): Promise<File[]> {
    if (!this.directory || !this.db) process.exit(1)

    const res = await this.db
      .update(files)
      .set({ rating: rate.rating })
      .where(eq(files.id, rate.id))
      .returning()
    return res
  }

  async listDirectories(): Promise<Directory[]> {
    if (!this.directory) process.exit(1)

    // Get the original list of all the directories
    const directories: (Directory | null)[] = []
    for await (const entry of glob(this.directory + '/**/')) {
      if (path.relative(this.directory, entry) == '') {
        continue
      } else {
        directories.push({
          name: path.basename(entry),
          path: path.relative(this.directory, entry),
          fullPath: entry,
          children: []
        })
      }
    }

    // Sort by longest path
    if (process.platform !== 'win32') {
      directories.sort((a, b) => {
        if (a && b) {
          return b.path.split('/').length - a.path.split('/').length
        } else {
          return 0
        }
      })
    } else {
      directories.sort((a, b) => {
        if (a && b) {
          return b.path.split('\\\\').length - a.path.split('\\\\').length
        } else {
          return 0
        }
      })
    }

    let index = 0
    for (const directory of [...directories]) {
      // Only look for nested paths so we can skip checking *every* path against every other one
      if (directory != null && directory.path.includes('/')) {
        // Check if directories list contains the path minus the last section
        const loc = directories.findIndex((d) => {
          if (d != null) {
            return d.path == path.dirname(directory.path)
          } else {
            return false
          }
        })

        if (loc && directories[loc] != null) {
          directories[loc].children.push(directory)
          directories[index] = null
        }
      }
      index = index + 1
    }
    const filtered: Directory[] = directories.filter((i) => i != null)
    filtered.sort((a, b) => a.path.length - b.path.length)

    return [
      {
        name: path.basename(this.directory),
        path: '',
        fullPath: this.directory,
        children: filtered
      }
    ]
  }

  private async fileHash(filePath, algorithm = 'sha256'): Promise<string> {
    const hash = createHash(algorithm)
    const stream = createReadStream(filePath)

    for await (const chunk of stream) {
      hash.update(chunk)
    }

    return hash.digest('hex')
  }
}

type Directory = {
  name: string
  path: string
  fullPath: string
  children: Directory[]
}

type File = {
  id: number
  path: string
  hash: string
  indexed: Date
  rating: number
}

type Tag = {
  id: number
  name: string
  created: Date
}
