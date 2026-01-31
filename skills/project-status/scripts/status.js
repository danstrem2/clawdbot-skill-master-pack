const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function run(cmd) {
    try {
        return execSync(cmd).toString().trim();
    } catch (e) {
        return `Error: ${e.message}`;
    }
}

console.log("=== PROJECT STATUS REVIEW ===");

// 1. System Resources
console.log("\n[1] System Resources:");
console.log("---------------------");
console.log(run('free -m | grep Mem | awk \'{print "Memory: Used "$3"MB / Total "$2"MB"}\''));
console.log(run('df -h . | tail -n 1 | awk \'{print "Disk: Used "$3" / Total "$2" ("$5")"}\''));

// 2. PM2 Processes
console.log("\n[2] Active Services (PM2):");
console.log("---------------------");
try {
    const pm2Json = JSON.parse(run('pm2 jlist'));
    if (pm2Json.length === 0) {
        console.log("No PM2 processes running.");
    } else {
        pm2Json.forEach(proc => {
            const status = proc.pm2_env.status === 'online' ? '✅ ONLINE' : '❌ ' + proc.pm2_env.status;
            console.log(`- [${proc.pm_id}] ${proc.name}: ${status} (Mem: ${(proc.monit.memory / 1024 / 1024).toFixed(1)}MB, CPU: ${proc.monit.cpu}%)`);
        });
    }
} catch (e) {
    console.log("Could not read PM2 status (is PM2 installed?)");
}

// 3. Project Config
console.log("\n[3] Configuration Check:");
console.log("---------------------");
const envPath = path.join(__dirname, '../../../../.env');
if (fs.existsSync(envPath)) {
    console.log("✅ .env file exists");
    // Simple check for key vars
    const envContent = fs.readFileSync(envPath, 'utf8');
    const checks = ['PORT', 'WEBHOOK_PORT', 'ADMIN_PASSWORD'];
    checks.forEach(key => {
        if (envContent.includes(`${key}=`)) {
            console.log(`   - ${key}: CONSTANT`);
        } else {
            console.log(`   - ${key}: ⚠️ MISSING`);
        }
    });
} else {
    console.log("❌ .env file MISSING!");
}

console.log("\n=== END STATUS ===");
