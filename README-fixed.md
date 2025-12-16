Healthkey System — patched for npm/ajv resolution

What I changed
- Ensured "react-scripts": "^5.0.1" in package.json.
- Added dependency "ajv": "6.12.6" (legacy AJV) to satisfy packages expecting ajv v6 paths.
- Added "overrides": { "ajv": "6.12.6" } to force resolution when using npm 8/9.

Recommended Windows install & run (PowerShell):
1. Open PowerShell as Administrator.
2. From project root:
   cd "C:\Users\<you>\Downloads\Healthkey_System"
3. Clean previous installs:
   if (Test-Path node_modules) { Remove-Item node_modules -Recurse -Force }
   if (Test-Path package-lock.json) { Remove-Item package-lock.json -Force }
   npm cache clean --force
4. Install dependencies (use --legacy-peer-deps to avoid peer conflicts):
   npm install --legacy-peer-deps
5. Start dev server:
   npm start
   # fallback:
   npx react-scripts start

If you still see "Cannot find module 'ajv/dist/compile/codegen'":
- Ensure node and npm versions are compatible (Node 18 + npm 9 is OK).
- If npm still resolves a different ajv, paste here the output of:
   npm ls ajv --all

Notes:
- I created a backup of the original package.json at package.json.patched_backup
- This patch pins ajv to v6.12.6 to restore the older API paths required by webpack dev server toolchain.
