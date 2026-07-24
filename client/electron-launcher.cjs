const { spawn } = require('child_process');
const path = require('path');

// Spawn the Vite process
const vite = spawn('npx', ['vite'], {
  cwd: __dirname,
  shell: true
});

let electronStarted = false;

vite.stdout.on('data', (data) => {
  const output = data.toString();
  console.log('[Vite]', output.trim());

  // Look for local dev server URL printed by Vite
  const match = output.match(/(http:\/\/localhost:\d+\/)/i) || output.match(/(http:\/\/127\.0\.0\.1:\d+\/)/i);
  if (match && !electronStarted) {
    electronStarted = true;
    const url = match[1];
    console.log(`[Launcher] Vite server identified at ${url}. Spawning Electron...`);

    const electronEnv = { ...process.env, VITE_DEV_SERVER_URL: url };
    const electron = spawn('npx', ['electron', '.'], {
      cwd: __dirname,
      env: electronEnv,
      shell: true
    });

    electron.stdout.on('data', (d) => console.log('[Electron]', d.toString().trim()));
    electron.stderr.on('data', (d) => console.error('[Electron Error]', d.toString().trim()));

    electron.on('close', (code) => {
      console.log(`[Launcher] Electron exited with code ${code}. Cleaning up Vite...`);
      vite.kill();
      process.exit(code);
    });
  }
});

vite.stderr.on('data', (data) => {
  console.error('[Vite Error]', data.toString().trim());
});

vite.on('close', (code) => {
  if (!electronStarted) {
    console.error(`[Launcher] Vite exited prematurely with code ${code}`);
    process.exit(code);
  }
});
