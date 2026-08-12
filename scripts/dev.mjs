#!/usr/bin/env node
/**
 * Menjalankan dev server frontend dan backend sekaligus.
 *
 * Ditulis dengan Node murni tanpa dependensi (mis. concurrently) supaya root
 * repo tidak perlu punya node_modules sendiri — setiap dependensi tinggal di
 * folder frontend/ atau backend/ masing-masing.
 */
import { spawn } from 'node:child_process';

const RESET = '\x1b[0m';

const targets = [
  { name: 'web', dir: 'frontend', color: '\x1b[36m' }, // cyan
  { name: 'api', dir: 'backend', color: '\x1b[35m' }, // magenta
];

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const children = [];
let shuttingDown = false;

function prefixed(target, chunk) {
  const label = `${target.color}[${target.name}]${RESET} `;
  return String(chunk)
    .split(/\r?\n/)
    .filter((line, i, arr) => line !== '' || i < arr.length - 1)
    .map((line) => label + line)
    .join('\n');
}

for (const target of targets) {
  const child = spawn(npm, ['run', 'dev'], {
    cwd: new URL(`../${target.dir}/`, import.meta.url),
    stdio: ['inherit', 'pipe', 'pipe'],
    shell: process.platform === 'win32',
  });

  child.stdout.on('data', (c) => console.log(prefixed(target, c)));
  child.stderr.on('data', (c) => console.error(prefixed(target, c)));

  child.on('exit', (code) => {
    if (shuttingDown) return;
    // Bila salah satu server mati, hentikan yang lain agar tidak ada proses
    // menggantung yang menahan port.
    console.error(`${target.color}[${target.name}]${RESET} berhenti (exit ${code}).`);
    shutdown(code ?? 1);
  });

  children.push(child);
}

function shutdown(code) {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const child of children) {
    if (!child.killed) child.kill();
  }
  process.exit(code);
}

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => shutdown(0));
}
