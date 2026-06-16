import { app, shell, BrowserWindow, protocol, net } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

import SeiriApp from './app'

SeiriApp.registerProtocol()

const myApp = new SeiriApp()
myApp.init()

export default SeiriApp