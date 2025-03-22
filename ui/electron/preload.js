const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  getStrategies: () => ipcRenderer.invoke('get-strategies'),
  
  // Add other API methods needed by the renderer
  app: {
    getVersion: () => process.env.npm_package_version || '0.1.0',
  },
  
  // File system operations
  fs: {
    readFile: (filepath) => ipcRenderer.invoke('read-file', filepath),
    saveFile: (filepath, content) => ipcRenderer.invoke('save-file', filepath, content),
  },
}); 