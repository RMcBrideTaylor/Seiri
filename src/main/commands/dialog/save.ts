import { ipcMain } from 'electron'
import { FileManager } from '../../filemanager'

export default function saveCollection(): void {
  ipcMain.handle('dialog:saveCollection', async (_event, args) => {
    // Create an instance
    const fileManager = FileManager.getInstance()
    fileManager.createCollection(args)

    return null
  })
}
