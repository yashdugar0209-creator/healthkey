// scripts/create-ajv-shim.js
const fs = require('fs');
const path = require('path');

function writeShim() {
  try {
    const ajvDistCompileDir = path.join(process.cwd(), 'node_modules', 'ajv', 'dist', 'compile');
    if (!fs.existsSync(ajvDistCompileDir)) {
      fs.mkdirSync(ajvDistCompileDir, { recursive: true });
    }
    const shimPath = path.join(ajvDistCompileDir, 'codegen.js');
    // Only write shim if it doesn't exist
    if (!fs.existsSync(shimPath)) {
      const shim = `// Compatibility shim for packages that require('ajv/dist/compile/codegen')
module.exports = require('../../lib/compile');`;
      fs.writeFileSync(shimPath, shim, { encoding: 'utf8' });
      console.log('ajv codegen shim created at', shimPath);
    } else {
      console.log('ajv codegen shim already exists:', shimPath);
    }
  } catch (err) {
    console.error('Failed to write ajv shim:', err && err.message ? err.message : err);
    // non-fatal
  }
}

writeShim();
