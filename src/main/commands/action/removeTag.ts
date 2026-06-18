import { ipcMain } from 'electron'
import { FileManager } from '../../filemanager'

export default function removeTag(): void {
  ipcMain.handle('action:removeTag', async (_event, tagRequest) => {
    // Create an instance
    const fileManager = FileManager.getInstance()

    // Add Tag using file manager
    fileManager.removeTag(tagRequest.id, tagRequest.tagId)

    return
  })
}
