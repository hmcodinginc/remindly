const { contextBridge } = require('electron')

// Expose safe platform helper
contextBridge.exposeInMainWorld('electron', {
  isDesktop: true,
})
