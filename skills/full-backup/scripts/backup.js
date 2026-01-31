const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Determine paths relative to the skill script location
// .agent/skills/full-backup/scripts/backup.js
// Project root is 4 levels up
const PROJECT_ROOT = path.resolve(__dirname, '../../../../');
const PARENT_DIR = path.resolve(PROJECT_ROOT, '..'); // Directory ABOVE the project

function getTimestamp() {
    const now = new Date();
    return now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
}


const args = process.argv.slice(2);
// Sanitize input: allow alphanumeric, hyphens, underscores. Replace spaces with underscores.
const rawNote = args.join('_'); // Join all args in case user didn't use quotes
const note = rawNote ? `_${rawNote.replace(/[^a-zA-Z0-9_-]/g, '_')}` : '';

function runBackup() {
    const timestamp = getTimestamp();
    const backupName = `backup_full_${timestamp}${note}`;
    const targetPath = path.join(PARENT_DIR, backupName);

    console.log(`[BACKUP] Starting Full Project Backup...`);
    console.log(`[BACKUP] Source: ${PROJECT_ROOT}`);
    console.log(`[BACKUP] Destination: ${targetPath}`);

    // Command uses rsync to exclude heavy folders
    const command = `rsync -av --exclude 'node_modules' --exclude '.git' --exclude '.agent/skills' "${PROJECT_ROOT}/" "${targetPath}/"`;

    try {
        execSync(command, { stdio: 'inherit' });
        console.log(`\n[BACKUP] ✅ Success! Backup saved to: ${targetPath}`);
    } catch (error) {
        console.error(`[BACKUP] ❌ Error:`, error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    runBackup();
}
