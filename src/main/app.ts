import { app, shell, BrowserWindow, protocol, net, Menu } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import registerCommands from './commands'

export default class SeiriApp {
  private mainWindow
  private modelID: string = 'com.seiri'

  constructor() {
    this.mainWindow = null

    this.createWindow = this.createWindow.bind(this)
    this.activate = this.activate.bind(this)
    this.close = this.close.bind(this)
  }

  public init(): void {
    app.whenReady().then(() => {
      console.log('Starting application...')

      this.setProtocolHandler()
      console.log('Protocol Set...')

      this.setUpDevTools()
      console.log('Devtools Set...')

      this.setModelId()
      console.log('Model ID Set...')

      this.registerIPC()
      console.log('IPC Registered...')

      this.mainWindow = this.createWindow()
      console.log('Window Created.')
    })
  }

  public close(): void {
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit()
      }
    })
  }

  public activate(): void {
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) this.createWindow()
    })
  }

  public createWindow(): BrowserWindow {
    const mainWindow = new BrowserWindow({
      width: 900,
      height: 670,
      show: true,
      titleBarStyle: 'hidden',
      autoHideMenuBar: true,
      ...(process.platform === 'linux' ? { icon } : {}),
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false
      }
    })

    mainWindow.webContents.setWindowOpenHandler((details) => {
      shell.openExternal(details.url)
      return { action: 'deny' }
    })

    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
      mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
    }

    return mainWindow
  }

  public static registerProtocol(): void {
    protocol.registerSchemesAsPrivileged([
      {
        scheme: 'smag',
        privileges: {
          standard: true,
          secure: true,
          bypassCSP: true,
          stream: true,
          supportFetchAPI: true
        }
      }
    ])
  }

  private registerIPC(): void {
    registerCommands()
  }

  private setModelId(): void {
    electronApp.setAppUserModelId(this.modelID)
  }

  private setProtocolHandler(): void {
    protocol.handle('smag', (request) => {
      const filePath = request.url.replace('smag://', 'file:///')
      return net.fetch(filePath)
    })
  }

  private setUpDevTools(): void {
    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window)
    })
  }
}
