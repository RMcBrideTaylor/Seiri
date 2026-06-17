// Actions
import indexFiles from './action/indexFiles'
import listDirectories from './action/listDirectories'
import listFiles from './action/listFiles'
import openFile from './action/openFile'
import openPreview from './action/openPreview'
import rateFile from './action/rateFile'

// Dialogs
import newCollection from './dialog/new'
import openCollection from './dialog/open'
import saveCollection from './dialog/save'

export default function registerCommands(): void {
  indexFiles()
  listDirectories()
  listFiles()
  rateFile()
  openFile()
  openPreview()

  newCollection()
  openCollection()
  saveCollection()
}
