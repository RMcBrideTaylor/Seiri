import { ipcMain } from 'electron'
import fs from 'node:fs'

export default function readFile(): void {
  ipcMain.handle('action:readFile', async (_event, path) => {
    try {
      const dat = fs.readFileSync(path)
      const buffer = Buffer.from(dat)
      return buffer
    } catch (error) {
      console.error('Could not read file:', error)
      return null
    }
  })
}
