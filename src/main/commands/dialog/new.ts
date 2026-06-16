import { ipcMain, dialog } from 'electron'

export default function newCollection(): void {
  // Open Dialog to Create New
  ipcMain.handle('dialog:createCollection', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openDirectory']
    })

    if (!canceled) {
      return filePaths[0]
    } else {
      return
    }
  })
}
