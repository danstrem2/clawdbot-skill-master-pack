const fs = require('fs');
const path = require('path');

// Determine log directory (standard PM2 location or local)
const logDir = path.resolve(__dirname, '../../../../bot.log'); // Based on file list seeing bot.log in root
// Also check PM2 standard
const homeDir = process.env.HOME || process.env.USERPROFILE;
const pm2LogDir = path.join(homeDir, '.pm2/logs');

console.log("=== ERROR SCAN REPORT ===");

function scanFile(filePath, limit = 20) {
    if (!fs.existsSync(filePath)) return;

    console.log(`\nScanning: ${path.basename(filePath)}`);
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n');
        const errors = lines.filter(l => l.toLowerCase().includes('error') || l.toLowerCase().includes('exception') || l.toLowerCase().includes('fail'));

        console.log(`Found ${errors.length} error lines.`);
        if (errors.length > 0) {
            console.log("--- Last 10 Errors ---");
            errors.slice(-10).forEach(e => console.log(e.trim()));
        }
    } catch (e) {
        console.error(`Failed to read ${filePath}`);
    }
}

// Scan local project log
scanFile(logDir);

// Scan PM2 logs if available
if (fs.existsSync(pm2LogDir)) {
    const files = fs.readdirSync(pm2LogDir).filter(f => f.endsWith('.err.log') || f.endsWith('-error.log'));
    files.forEach(f => scanFile(path.join(pm2LogDir, f)));
}
