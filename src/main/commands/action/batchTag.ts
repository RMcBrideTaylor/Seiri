import { ipcMain } from 'electron'
import { FileManager } from '../../filemanager'

export default function batchTag(): void {
  ipcMain.handle('action:batchTag', async (_event, tagRequest) => {
    // Create an instance
    const fileManager = FileManager.getInstance()

    // Add Tag using file manager
    return fileManager.batchTag(JSON.parse(tagRequest.selected), tagRequest.tag)
  })
}
