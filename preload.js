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
    },
    getSonioxApiKey: async () => {
        return await ipcRenderer.invoke('get-soniox-api-key');
    },
    getElevenLabsApiKey: async () => {
        return await ipcRenderer.invoke('get-elevenlabs-api-key');
    },
    initElevenLabs: async () => {
        return await ipcRenderer.invoke('init-elevenlabs');
    },
    convertTextToSpeech: async (text) => {
        return await ipcRenderer.invoke('elevenlabs-tts', text);
    },
    stopTextToSpeech: async () => {
        return await ipcRenderer.invoke('stop-elevenlabs-tts');
    },
    onElevenLabsAudioChunk: (callback) => {
        ipcRenderer.on('elevenlabs-audio-chunk', (event, chunk) => {
            callback(chunk);
        });
    }
});