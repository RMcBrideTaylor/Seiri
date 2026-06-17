import { ipcMain } from 'electron'
import { FileManager } from '../../filemanager'

export default function openFile(): void {
  ipcMain.handle('action:openFile', async (_event, id) => {
    // Create an instance
    const fileManager = FileManager.getInstance()

    return await fileManager.getFile(id)
  })
}
