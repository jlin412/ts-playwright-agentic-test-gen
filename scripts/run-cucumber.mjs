import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';

async function rmrf(p) {
  await fs.rm(p, { recursive: true, force: true });
}

async function mkdirp(p) {
  await fs.mkdir(p, { recursive: true });
}

function runNodeWithArgs(args) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, args, {
      stdio: 'inherit',
      env: process.env,
    });

    child.on('exit', (code, signal) => {
      if (signal) return resolve(1);
      resolve(code ?? 1);
    });
  });
}

function openFile(filePath) {
  const platform = process.platform;

  if (platform === 'darwin') {
    spawn('open', [filePath], { stdio: 'ignore', detached: true }).unref();
    return;
  }

  if (platform === 'win32') {
    // `start` is a cmd builtin.
    spawn('cmd', ['/c', 'start', '', filePath], { stdio: 'ignore', detached: true }).unref();
    return;
  }

  // Linux and others
  spawn('xdg-open', [filePath], { stdio: 'ignore', detached: true }).unref();
}

async function main() {
  const reportDir = path.resolve('cucumber-report');
  await rmrf(reportDir);
  await mkdirp(reportDir);

  const cucumberBin = path.resolve('node_modules', '@cucumber', 'cucumber', 'bin', 'cucumber-js');

  const baseArgs = [
    '--loader',
    'ts-node/esm',
    cucumberBin,
    '--import',
    'cucumber/support/**/*.ts',
    '--import',
    'cucumber/steps/**/*.ts',
    '--format',
    'summary',
    '--format',
    'html:cucumber-report/cucumber.html',
    'cucumber/features/**/*.feature',
  ];

  // Forward any extra args (e.g., --tags @ui)
  const rawArgs = process.argv.slice(2);
  const openReport = rawArgs.includes('--open-report') || rawArgs.includes('--open');
  const extraArgs = rawArgs.filter((a) => a !== '--open-report' && a !== '--open');

  const exitCode = await runNodeWithArgs([...baseArgs, ...extraArgs]);

  if (openReport) {
    const reportPath = path.resolve('cucumber-report', 'cucumber.html');
    openFile(reportPath);
  }

  process.exit(exitCode);
}

await main();
