const { contextBridge, ipcRenderer } = require('electron');

// Expose platform info and console logging
contextBridge.exposeInMainWorld('electronAPI', {
    platform: process.platform,
    logToMain: async (message) => {
        await ipcRenderer.invoke('console-log', message);
    },
    logError: async (message) => {
        await ipcRenderer.invoke('console-error', message);
    },
    logWarn: async (message) => {
        await ipcRenderer.invoke('console-warn', message);
    }
});