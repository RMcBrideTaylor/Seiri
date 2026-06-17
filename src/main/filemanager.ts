import { BetterSQLite3Database, drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import { eq, like, and } from 'drizzle-orm'

import { files } from './db/file'
import { filesToTags, tags } from './db/tag'

import { createReadStream } from 'node:fs'
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

    // Associate it with the file by id
    await this.db.insert(filesToTags).values({
      fileId: id,
      tagId: t[0].id
    })

    return t[0]
  }

  async getFile(id): Promise<File> {
    if (this.db == null || this.directory == null) {
      process.exit(1)
    }

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
    }
    return
  }

  async listFiles(): Promise<File[]> {
    if (!this.directory || !this.db) process.exit(1)

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
    const directories: Directory[] = []
    for await (const entry of glob(this.directory + '/**/')) {
      if (path.relative(this.directory, entry) == '') {
        continue
      } else {
        directories.push({
          name: path.basename(entry),
          path: path.relative(this.directory, entry),
          children: []
        })
      }
    }

    // Sort by longest path
    directories.sort((a, b) => b.path.length - a.path.length)

    for (const [i, directory] of directories.entries()) {
      // Only look for nested paths so we can skip checking *every* path against every other one
      if (directory.path.includes('/')) {
        // Check if directories list contains the path minus the last section
        const index = directories.findIndex((d) => d.path == path.dirname(directory.path))

        if (index) {
          directories[index].children.push(directory)
          directories.splice(i, 1)
        }
      }
    }
    directories.sort((a, b) => a.path.length - b.path.length)

    return [
      {
        name: path.basename(this.directory),
        path: '',
        children: directories
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
