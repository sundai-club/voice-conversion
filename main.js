const { app, BrowserWindow, Tray, Menu, nativeImage, ipcMain } = require('electron');
const path = require('path');
require('dotenv').config();
let tray = null;
let window = null;

// Set up IPC handlers for console output
ipcMain.handle('console-log', (event, message) => {
  console.log(message);
});

ipcMain.handle('console-error', (event, message) => {
  console.error(message);
});

ipcMain.handle('console-warn', (event, message) => {
  console.warn(message);
});

// Handle API key requests from renderer
ipcMain.handle('get-soniox-api-key', () => {
  return process.env.SONIOX_API_KEY || null;
});





function createWindow() {
  window = new BrowserWindow({
    width: 350,
    height: 700,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false,
    transparent: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      experimentalFeatures: true,
      enableRemoteModule: false,
      webSecurity: false
    }
  });

  window.loadFile('index.html');

  window.on('blur', () => {
    // Add a small delay to prevent accidental hiding during click events
    setTimeout(() => {
      if (window && !window.isDestroyed() && !window.webContents.isDevToolsOpened()) {
        window.hide();
      }
    }, 100);
  });

  window.on('unresponsive', () => {
    console.error('Window became unresponsive');
  });

  window.webContents.on('render-process-gone', (event, details) => {
    console.error('Render process gone:', details);
  });
}

function createTray() {
  // Use voice-search.png as the tray icon
  const icon = nativeImage.createFromPath(path.join(__dirname, 'icon.png'));
  // const icon = nativeImage.createFromPath('icon.svg');
  icon.setTemplateImage(true); // Makes icon adapt to menu bar theme

  //const icon = path.join(__dirname, 'icon.png')
  tray = new Tray(icon);
  
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show Microphones',
      click: () => {
        if (window.isVisible()) {
          window.hide();
        } else {
          showWindow();
        }
      }
    },
    {
      label: 'Refresh',
      click: () => {
        if (window) {
          window.webContents.reload();
        }
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Open DevTools',
      click: () => {
        if (window) {
          window.webContents.openDevTools();
        }
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Quit',
      click: () => {
        app.quit();
      }
    }
  ]);

  tray.setContextMenu(contextMenu);
  tray.setToolTip('Microphone List');
  
  tray.on('click', () => {
    if (window.isVisible()) {
      window.hide();
    } else {
      showWindow();
    }
  });
}

function showWindow() {
  const trayBounds = tray.getBounds();
  const windowBounds = window.getBounds();
  
  const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2));
  const y = Math.round(trayBounds.y + trayBounds.height + 4);
  
  window.setPosition(x, y, false);
  window.show();
  window.focus();
}

app.whenReady().then(() => {
  createWindow();
  createTray();
});

app.on('window-all-closed', (e) => {
  e.preventDefault();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.dock.hide();