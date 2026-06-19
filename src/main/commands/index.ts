// Actions
import addTag from './action/addTag'
import batchTag from './action/batchTag'
import indexFiles from './action/indexFiles'
import listDirectories from './action/listDirectories'
import listFiles from './action/listFiles'
import openFile from './action/openFile'
import openPreview from './action/openPreview'
import rateFile from './action/rateFile'
import readFile from './action/readFile'
import refresh from './action/refresh'
import removeTag from './action/removeTag'

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
  readFile()

  addTag()
  batchTag()
  removeTag()

  refresh()

  newCollection()
  openCollection()
  saveCollection()
}
