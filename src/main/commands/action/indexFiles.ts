import { ipcMain } from 'electron'
import { FileManager } from '../../filemanager'

export default function indexFiles(): void {
  ipcMain.handle('action:indexFiles', async () => {
    // Create an instance
    const fileManager = FileManager.getInstance()

    // Trigger Index
    fileManager.indexFiles()

    return null
  })
}
