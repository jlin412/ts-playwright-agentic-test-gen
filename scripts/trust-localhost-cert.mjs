import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

const CERT_DIR = path.join(PROJECT_ROOT, '.cert');
const CERT_PATH = path.join(CERT_DIR, 'localhost-cert.pem');

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: 'inherit' });
    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} exited with code ${code ?? 'unknown'}`));
    });
    child.on('error', reject);
  });
}

async function main() {
  if (!(await exists(CERT_PATH))) {
    console.error('Localhost cert not found. Generate it by running:');
    console.error('  npm run cucumber:open-report');
    process.exit(1);
  }

  console.log('Trusting the localhost cert in the macOS System keychain (may require admin password)...');
  const args = [
    'add-trusted-cert',
    '-d',
    '-r',
    'trustRoot',
    '-k',
    '/Library/Keychains/System.keychain',
    CERT_PATH,
  ];

  try {
    await run('security', args);
  } catch (err) {
    console.error(String(err));
    console.error('\nRe-run with sudo (recommended):');
    console.error(`  sudo security ${args.map((a) => (a.includes(' ') ? JSON.stringify(a) : a)).join(' ')}`);
    process.exit(1);
  }

  console.log('Done. Fully quit and relaunch Chrome, then retry the Trace Viewer link.');
}

await main();
