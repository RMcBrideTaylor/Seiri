import { BrowserWindow, ipcMain } from 'electron'

export default function refresh(): void {
  ipcMain.on('action:refresh', async () => {
    const window = BrowserWindow.getAllWindows().find((b) => b.title == 'Main')
    if (window) {
      window.webContents.send('refresh')
    } else {
      console.log('Could not identify main window')
    }
  })
}
