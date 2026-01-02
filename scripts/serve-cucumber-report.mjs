import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

const REPORT_DIR = path.join(PROJECT_ROOT, 'cucumber-report');
const CERT_DIR = path.join(PROJECT_ROOT, '.cert');
const KEY_PATH = path.join(CERT_DIR, 'localhost-key.pem');
const CERT_PATH = path.join(CERT_DIR, 'localhost-cert.pem');
const OPENSSL_CONFIG_PATH = path.join(CERT_DIR, 'openssl-localhost.cnf');

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function certHasSan() {
  try {
    await fs.access(CERT_PATH);
  } catch {
    return false;
  }

  const output = await new Promise((resolve, reject) => {
    const child = spawn('openssl', ['x509', '-in', CERT_PATH, '-noout', '-text'], {
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (d) => (stdout += d.toString('utf8')));
    child.stderr.on('data', (d) => (stderr += d.toString('utf8')));
    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) resolve(stdout);
      else reject(new Error(stderr || `openssl exited with code ${code ?? 'unknown'}`));
    });
  });

  return output.includes('Subject Alternative Name') && output.includes('DNS:localhost');
}

async function ensureCert() {
  await fs.mkdir(CERT_DIR, { recursive: true });

  const hasKey = await exists(KEY_PATH);
  const hasCert = await exists(CERT_PATH);

  if (hasKey && hasCert && (await certHasSan())) return;

  if (hasKey && hasCert) {
    // Regenerate if an older cert is missing SAN (modern clients require it).
    await fs.rm(KEY_PATH, { force: true });
    await fs.rm(CERT_PATH, { force: true });
  }

  // Self-signed cert for localhost. Include SAN for modern TLS clients.
  const opensslConfig = `
[req]
default_bits = 2048
prompt = no
default_md = sha256
distinguished_name = dn
x509_extensions = v3_req

[dn]
CN = localhost

[v3_req]
subjectAltName = @alt_names
keyUsage = digitalSignature
extendedKeyUsage = serverAuth

[alt_names]
DNS.1 = localhost
IP.1 = 127.0.0.1
IP.2 = ::1
`;

  await fs.writeFile(OPENSSL_CONFIG_PATH, opensslConfig, 'utf8');

  const args = [
    'req',
    '-x509',
    '-newkey',
    'rsa:2048',
    '-nodes',
    '-keyout',
    KEY_PATH,
    '-out',
    CERT_PATH,
    '-days',
    '730',
    '-config',
    OPENSSL_CONFIG_PATH,
  ];

  await new Promise((resolve, reject) => {
    const child = spawn('openssl', args, { stdio: 'inherit' });
    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`openssl exited with code ${code ?? 'unknown'}`));
    });
    child.on('error', reject);
  });
}

async function main() {
  const port = process.env.CUCUMBER_REPORT_PORT ?? '9325';

  if (!(await exists(REPORT_DIR))) {
    console.error('cucumber-report does not exist. Run a cucumber suite first.');
    process.exit(1);
  }

  await ensureCert();

  console.log('Serving cucumber-report over HTTPS so trace.playwright.dev can fetch trace zips.');
  console.log('If Trace Viewer still cannot load, your browser must trust the local cert:');
  console.log(`  Configure your browser or OS to trust the local certificate at: ${CERT_PATH}`);
  console.log('  Refer to the project documentation for detailed trust-configuration steps.');

  const args = [
    REPORT_DIR,
    '-p',
    String(port),
    '--cors',
    '--ssl',
    '--key',
    KEY_PATH,
    '--cert',
    CERT_PATH,
  ];

  // Use the locally installed http-server.
  const httpServerBin = path.join(PROJECT_ROOT, 'node_modules', 'http-server', 'bin', 'http-server');
  const child = spawn(process.execPath, [httpServerBin, ...args], {
    stdio: 'inherit',
    env: process.env,
  });

  child.on('exit', (code) => process.exit(code ?? 0));
}

await main();
