import { ipcMain } from 'electron'
import { FileManager } from '../../filemanager'

export default function addTag(): void {
  ipcMain.handle('action:addTag', async (_event, tagRequest) => {
    // Create an instance
    const fileManager = FileManager.getInstance()

    // Add Tag using file manager
    return fileManager.addTag(tagRequest.id, tagRequest.tag)
  })
}
