import { ipcMain } from 'electron'
import { FileManager } from '../../filemanager'

export default function rateFile(): void {
  ipcMain.handle('action:rateFile', async (_event, args) => {
    // Create an instance
    const fileManager = FileManager.getInstance()

    return await fileManager.rateFile(args)
  })
}
