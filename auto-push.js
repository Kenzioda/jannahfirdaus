// Auto-push script for Windows using Node.js and chokidar
// Watches for file changes and pushes to remote automatically

const chokidar = require('chokidar');
const { exec } = require('child_process');

const WATCH_PATH = '.'; // Watch the whole project directory
const DEBOUNCE_MS = 3000; // Wait 3 seconds after last change

let timeout = null;

function autoPush() {
  exec('git add .', (err) => {
    if (err) return console.error('git add failed:', err);
    exec('git commit -m "Auto-commit: changes detected"', (err, stdout, stderr) => {
      if (err) {
        if (stderr.includes('nothing to commit')) return; // No changes
        return console.error('git commit failed:', err);
      }
      exec('git push', (err) => {
        if (err) return console.error('git push failed:', err);
        console.log('Changes pushed to remote.');
      });
    });
  });
}

chokidar.watch(WATCH_PATH, {
  ignored: /(^|[\\/])\../, // ignore dotfiles
  persistent: true,
  ignoreInitial: true,
}).on('all', (event, path) => {
  if (timeout) clearTimeout(timeout);
  timeout = setTimeout(autoPush, DEBOUNCE_MS);
  console.log(`Detected change: ${event} on ${path}`);
});

console.log('Watching for file changes to auto-push...');
