const { app, BrowserWindow, screen } = require('electron')
const path = require('path')

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: screen.getPrimaryDisplay().workAreaSize.width,
    height: screen.getPrimaryDisplay().workAreaSize.height,
    minWidth: 1200,
    minHeight: 800,
  })

  // 使用 loadFile 加载 electron/index.html 文件
  mainWindow.loadURL('http://localhost:5173/')
}

// 在应用准备就绪时调用函数
app.whenReady().then(() => {
  createWindow()
})
// 证书的链接验证失败时，触发该事件
app.on(
  'certificate-error',
  function (event, webContents, url, error, certificate, callback) {
    event.preventDefault()
    callback(true)
  }
)
