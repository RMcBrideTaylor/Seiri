import { ipcMain } from 'electron'
import { FileManager } from '../../filemanager'

export default function listDirectories(): void {
  ipcMain.handle('action:listDirectories', async () => {
    // Create an instance
    const fileManager = FileManager.getInstance()

    // Trigger Index
    return await fileManager.listDirectories()
  })
}
