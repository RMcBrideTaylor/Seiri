// Actions
import indexFiles from './action/indexFiles'
import listDirectories from './action/listDirectories'
import listFiles from './action/listFiles'

// Dialogs
import newCollection from './dialog/new'
import openCollection from './dialog/open'
import saveCollection from './dialog/save'

export default function registerCommands(): void {
  indexFiles()
  listDirectories()
  listFiles()

  newCollection()
  openCollection()
  saveCollection()
}
