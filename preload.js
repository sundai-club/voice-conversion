const { contextBridge } = require('electron');

// Expose platform info
contextBridge.exposeInMainWorld('electronAPI', {
    platform: process.platform
});