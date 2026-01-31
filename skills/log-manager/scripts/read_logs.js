const { execSync } = require('child_process');

const args = process.argv.slice(2);
const lines = args[0] || '50';
const botName = args[1] || 'all'; // can specify a bot name if needed, but pm2 logs usually handles id

console.log(`=== READING LAST ${lines} LINES OF LOGS ===`);

try {
    // pm2 logs --lines N --nostream
    // we use --nostream to get output and exit
    const cmd = `pm2 logs ${botName === 'all' ? '' : botName} --lines ${lines} --nostream`;
    const output = execSync(cmd).toString();
    console.log(output);
} catch (e) {
    console.error("Error reading logs:", e.message);
}
