// src/safeGet.js
export function safeGet(obj, path, defaultValue = undefined) {
  if (!obj || !path) return defaultValue;
  const keys = Array.isArray(path) ? path : String(path).split('.');
  let cur = obj;
  for (const k of keys) {
    if (cur == null) return defaultValue;
    cur = cur[k];
  }
  return cur === undefined ? defaultValue : cur;
}
