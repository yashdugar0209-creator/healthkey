// src/services/DataService.js
const STORAGE_KEY = 'healthkey_system';

function safeParse(str, fallback = {}) {
  try {
    return str ? JSON.parse(str) : fallback;
  } catch (e) {
    console.warn('DataService.safeParse JSON error:', e && e.message);
    return fallback;
  }
}

function safeStringify(obj) {
  try {
    return JSON.stringify(obj);
  } catch (e) {
    console.warn('DataService.safeStringify error:', e && e.message);
    return '{}';
  }
}

export const dataService = {
  init() {
    try {
      if (typeof localStorage === 'undefined') return;
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(STORAGE_KEY, safeStringify({}));
      } else {
        safeParse(raw, {});
      }
    } catch (e) {}
  },

  getAll() {
    try {
      const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
      return safeParse(raw, {});
    } catch (e) {
      return {};
    }
  },

  get(key, defaultValue = undefined) {
    try {
      if (!key) return this.getAll();
      const parts = String(key).split('.');
      let cur = this.getAll();
      for (const p of parts) {
        if (cur == null || typeof cur !== 'object' || !(p in cur)) return defaultValue;
        cur = cur[p];
      }
      return cur === undefined ? defaultValue : cur;
    } catch (e) {
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      if (!key) return false;
      const parts = String(key).split('.');
      const store = this.getAll();
      let cur = store;
      for (let i = 0; i < parts.length - 1; i++) {
        const p = parts[i];
        if (cur[p] == null || typeof cur[p] !== 'object') cur[p] = {};
        cur = cur[p];
      }
      cur[parts[parts.length - 1]] = value;
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, safeStringify(store));
      }
      return true;
    } catch (e) {
      return false;
    }
  },

  remove(key) {
    try {
      if (!key) return false;
      const parts = String(key).split('.');
      const store = this.getAll();
      let cur = store;
      for (let i = 0; i < parts.length - 1; i++) {
        cur = cur?.[parts[i]];
        if (!cur) return false;
      }
      delete cur[parts[parts.length - 1]];
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, safeStringify(store));
      }
      return true;
    } catch (e) {
      return false;
    }
  },

  clear() {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {}
  }
};

export default dataService;
