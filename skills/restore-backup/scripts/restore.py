import os
import sys
import subprocess
import shutil
from datetime import datetime

def restore_backup(backup_path, target_path="."):
    """
    Restores files from backup_path to target_path using rsync.
    Excludes .git and node_modules to avoid corrupting environment/history.
    """
    
    if not os.path.exists(backup_path):
        print(f"Error: Backup path '{backup_path}' does not exist.")
        sys.exit(1)

    print(f"Starting restoration from: {backup_path}")
    print(f"Target directory: {os.path.abspath(target_path)}")

    # Ensure trailing slash for rsync to copy contents, not the folder itself
    if not backup_path.endswith('/'):
        backup_path += '/'

    # rsync command
    # -a: archive mode (recursive, preserves permissions, timestamps, etc.)
    # -v: verbose
    # --overwrite: overwrite destination files
    cmd = [
        "rsync",
        "-av", 
        "--exclude", ".git",
        "--exclude", "node_modules",
        backup_path,
        target_path
    ]

    try:
        subprocess.run(cmd, check=True)
        print("\nRestoration completed successfully.")
        
        # Determine if we should restart services (optional, but good practice)
        if os.path.exists("package.json"):
             print("Note: You may need to restart your application (e.g., pm2 restart all).")

    except subprocess.CalledProcessError as e:
        print(f"Error during rsync: {e}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python restore.py <backup_path> [target_path]")
        sys.exit(1)
    
    backup_dir = sys.argv[1]
    target_dir = sys.argv[2] if len(sys.argv) > 2 else "."
    
    restore_backup(backup_dir, target_dir)
