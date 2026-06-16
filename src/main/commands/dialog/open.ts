import { ipcMain, dialog } from 'electron'
import { FileManager } from '../../filemanager'

export default function openCollection(): void {
  // Open Existing Project
  ipcMain.handle('dialog:openCollection', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      filters: [{ name: 'Seiri Collection', extensions: ['scol'] }],
      properties: ['openFile']
    })

    if (!canceled) {
      const fileManager = FileManager.getInstance()
      fileManager.loadCollection(filePaths[0])
      fileManager.indexFiles()
    }

    return
  })
}
