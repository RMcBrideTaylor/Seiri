import { ipcMain, shell, BrowserWindow } from 'electron'
import { is } from '@electron-toolkit/utils'
import { join } from 'path'
import icon from '../../../../resources/icon.png?asset'

export default function openPreview(): void {
  ipcMain.on('action:openPreview', async (_event, id) => {

    const newWindow = new BrowserWindow({
      width: 900,
      height: 670,
      show: true,
      titleBarStyle: 'hidden',
      autoHideMenuBar: true,
      title: 'Preview',
      ...(process.platform !== 'darwin' ? { titleBarOverlay: true, titleBarStyle: 'default' } : {}),
      ...(process.platform === 'linux' ? { icon } : {}),
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false
      }
    })

    newWindow.webContents.setWindowOpenHandler((details) => {
      shell.openExternal(details.url)
      return { action: 'deny' }
    })

    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      newWindow.loadURL(process.env['ELECTRON_RENDERER_URL'] + `/#/preview/${id}`)
    } else {
      newWindow.loadURL(`file://${join(__dirname, '../renderer/index.html')}#/preview/${id}`)
    }
  })
}
