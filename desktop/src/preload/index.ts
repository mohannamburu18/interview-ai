import { contextBridge, ipcRenderer } from 'electron';

export interface ParakeetAPI {
  // Store APIs
  store: {
    getAll: () => Promise<any>;
    get: (key: string) => Promise<any>;
    set: (key: string, value: any) => Promise<boolean>;
    update: (patch: Record<string, any>) => Promise<boolean>;
  };
  // Window controls
  window: {
    setOpacity: (opacity: number) => void;
    setIgnoreMouseEvents: (ignore: boolean) => void;
    minimize: () => void;
    close: () => void;
    setAlwaysOnTop: (flag: boolean) => void;
  };
  // Audio sources
  audio: {
    getSources: () => Promise<any[]>;
    getSystemSourceId: () => Promise<string | null>;
    logDebug: (msg: string) => void;
  };
  // Events / Hotkeys
  on: {
    onHotkeyToggleListening: (callback: () => void) => () => void;
    onHotkeyToggleCodeMode: (callback: () => void) => () => void;
    onHotkeyTriggerManualAnswer: (callback: () => void) => () => void;
  };
}

const parakeetAPI: ParakeetAPI = {
  store: {
    getAll: () => ipcRenderer.invoke('store:get-all'),
    get: (key: string) => ipcRenderer.invoke('store:get', key),
    set: (key: string, value: any) => ipcRenderer.invoke('store:set', key, value),
    update: (patch: Record<string, any>) => ipcRenderer.invoke('store:update', patch),
  },
  window: {
    setOpacity: (opacity: number) => ipcRenderer.send('window:set-opacity', opacity),
    setIgnoreMouseEvents: (ignore: boolean) => ipcRenderer.send('window:set-ignore-mouse-events', ignore),
    minimize: () => ipcRenderer.send('window:minimize'),
    close: () => ipcRenderer.send('window:close'),
    setAlwaysOnTop: (flag: boolean) => ipcRenderer.send('window:set-always-on-top', flag),
  },
  audio: {
    getSources: () => ipcRenderer.invoke('app:get-sources'),
    getSystemSourceId: () => ipcRenderer.invoke('app:get-system-source-id'),
    logDebug: (msg: string) => ipcRenderer.send('app:log-debug', msg),
  },
  on: {
    onHotkeyToggleListening: (callback: () => void) => {
      const listener = () => callback();
      ipcRenderer.on('hotkey:toggle-listening', listener);
      return () => ipcRenderer.removeListener('hotkey:toggle-listening', listener);
    },
    onHotkeyToggleCodeMode: (callback: () => void) => {
      const listener = () => callback();
      ipcRenderer.on('hotkey:toggle-code-mode', listener);
      return () => ipcRenderer.removeListener('hotkey:toggle-code-mode', listener);
    },
    onHotkeyTriggerManualAnswer: (callback: () => void) => {
      const listener = () => callback();
      ipcRenderer.on('hotkey:trigger-manual-answer', listener);
      return () => ipcRenderer.removeListener('hotkey:trigger-manual-answer', listener);
    },
  },
};

contextBridge.exposeInMainWorld('parakeetAPI', parakeetAPI);

