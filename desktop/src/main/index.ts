import { app, BrowserWindow, shell, ipcMain, globalShortcut, screen, desktopCapturer } from 'electron';
import { join } from 'path';
import { EncryptedLocalStore } from './store';

// Set environment flags
process.env.DIST_ELECTRON = join(__dirname, '../');
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist');
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, '../public')
  : process.env.DIST;

let mainWindow: BrowserWindow | null = null;
let store: EncryptedLocalStore | null = null;
let isOverlayHidden = false;

// Disable hardware acceleration issues for transparent windows on some Linux setups if necessary
// app.disableHardwareAcceleration();

async function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;

  const windowWidth = 460;
  const windowHeight = 680;
  const initialX = screenWidth - windowWidth - 40;
  const initialY = 60;

  mainWindow = new BrowserWindow({
    title: 'Parakeet Free Unlimited',
    width: windowWidth,
    height: windowHeight,
    minWidth: 360,
    minHeight: 400,
    x: initialX,
    y: initialY,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    hasShadow: false,
    skipTaskbar: false, // Visible in taskbar so user can click/find it easily
    show: true,
    resizable: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      backgroundThrottling: false,
    },
  });

  // Anti-Screen Share Protection: Undetectable in Zoom/Meet/Teams
  try {
    mainWindow.setContentProtection(true);
    console.log('[Parakeet] Screen share protection ENABLED (Undetectable).');
  } catch (err) {
    console.warn('[Parakeet] Failed to enable setContentProtection:', err);
  }

  mainWindow.setAlwaysOnTop(true, 'floating');
  mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
    mainWindow?.focus();
    console.log('[Parakeet] Window ready-to-show and displayed successfully.');
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(join(process.env.DIST || '', 'index.html'));
  }

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url);
    return { action: 'deny' };
  });
}

function registerGlobalShortcuts() {
  // Global Shortcuts
  const toggleOverlay = () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      if (isOverlayHidden) {
        mainWindow.show();
        isOverlayHidden = false;
      } else {
        mainWindow.hide();
        isOverlayHidden = true;
      }
    }
  };

  // Push-to-Talk / Toggle Listening Shortcut: Ctrl+Space (or Command+Space on Mac)
  const listenShortcut = process.platform === 'darwin' ? 'Command+Space' : 'Control+Space';
  globalShortcut.register(listenShortcut, () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('hotkey:toggle-listening');
    }
  });

  // Panic / Hide Shortcut: Ctrl+Shift+P & Ctrl+Shift+H
  globalShortcut.register('CommandOrControl+Shift+P', toggleOverlay);
  globalShortcut.register('CommandOrControl+Shift+H', toggleOverlay);

  // Manual Answer Trigger Shortcut: Ctrl+Enter / Cmd+Enter
  globalShortcut.register('CommandOrControl+Return', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('hotkey:trigger-manual-answer');
    }
  });

  // Code Mode Shortcut: Ctrl+Shift+C
  globalShortcut.register('CommandOrControl+Shift+C', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('hotkey:toggle-code-mode');
    }
  });
}

function setupIpcHandlers() {
  if (!store) {
    store = new EncryptedLocalStore();
  }

  // Auto-grant display media requests for loopback audio capture
  try {
    const { session } = require('electron');
    if (session.defaultSession.setDisplayMediaRequestHandler) {
      session.defaultSession.setDisplayMediaRequestHandler((_request: any, callback: any) => {
        desktopCapturer.getSources({ types: ['screen'] }).then((sources) => {
          if (sources.length > 0) {
            callback({ video: sources[0], audio: 'loopback' });
          } else {
            callback({});
          }
        });
      });
    }
  } catch (err) {
    console.warn('[Parakeet] setDisplayMediaRequestHandler warning:', err);
  }

  // Storage Handlers
  ipcMain.handle('store:get-all', () => {
    return store?.getAll();
  });

  ipcMain.handle('store:get', (_event, key: string) => {
    return store?.get(key as any);
  });

  ipcMain.handle('store:set', (_event, key: string, value: any) => {
    store?.set(key as any, value);
    return true;
  });

  ipcMain.handle('store:update', (_event, patch: any) => {
    store?.update(patch);
    return true;
  });

  // Window Manipulation Handlers
  ipcMain.on('window:set-opacity', (_event, opacity: number) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      const normalized = Math.max(0.2, Math.min(1.0, opacity));
      mainWindow.setOpacity(normalized);
    }
  });

  ipcMain.on('window:set-ignore-mouse-events', (_event, ignore: boolean) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.setIgnoreMouseEvents(ignore, { forward: true });
    }
  });

  ipcMain.on('window:minimize', () => {
    mainWindow?.minimize();
  });

  ipcMain.on('window:close', () => {
    mainWindow?.close();
  });

  ipcMain.on('window:set-always-on-top', (_event, flag: boolean) => {
    mainWindow?.setAlwaysOnTop(flag, 'screen-saver');
  });

  ipcMain.handle('app:get-sources', async () => {
    return await desktopCapturer.getSources({
      types: ['screen', 'window'],
      thumbnailSize: { width: 150, height: 150 },
    });
  });

  ipcMain.handle('app:get-system-source-id', async () => {
    const sources = await desktopCapturer.getSources({
      types: ['screen'],
    });
    if (sources.length > 0) {
      return sources[0].id;
    }
    return null;
  });

  ipcMain.on('app:log-debug', (_event, message: string) => {
    console.log(`[Renderer Audio Engine] ${message}`);
  });
}

app.whenReady().then(() => {
  setupIpcHandlers();
  createWindow();
  registerGlobalShortcuts();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

