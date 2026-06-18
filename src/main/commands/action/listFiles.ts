import { ipcMain } from 'electron'
import { FileManager } from '../../filemanager'

export default function listFiles(): void {
  ipcMain.handle('action:listFiles', async () => {
    // Create an instance
    const fileManager = FileManager.getInstance()

    // Trigger Index, then list the result
    return await fileManager.listFiles()
  })
}
