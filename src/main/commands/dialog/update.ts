import { ipcMain } from 'electron'
import { FileManager } from '../../filemanager'

export default function updateCollection(): void {
  ipcMain.handle('dialog:updateCollection', async (_event, args) => {
    // Create an instance
    const fileManager = FileManager.getInstance()
    //fileManager.updateCollection(args)

    return null
  })
}