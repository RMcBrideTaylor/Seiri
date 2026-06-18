import SeiriApp from './app'

SeiriApp.registerProtocol()

const myApp = new SeiriApp()
myApp.init()

export default SeiriApp