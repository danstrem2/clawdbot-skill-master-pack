const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configurações
const SOURCE_DIR = path.resolve(__dirname, '../../../..');
const TARGET_BASE_DIR = '/root/root/vendas-what/pizzaria/backups';
const LOG_FILE = path.join(SOURCE_DIR, 'backup.log');
const MAX_BACKUPS = 10; // Mantém os últimos 10 backups

function getTimestamp() {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toTimeString().split(' ')[0].replace(/:/g, '');
    return `${date}_${time}`;
}

function log(message) {
    const timestamp = new Date().toLocaleString();
    const logMessage = `[${timestamp}] ${message}\n`;
    console.log(message);
    fs.appendFileSync(LOG_FILE, logMessage);
}

function runBackup() {
    try {
        const timestamp = getTimestamp();
        const backupFileName = `backup_full_${timestamp}.tar.zst`;
        const targetPath = path.join(TARGET_BASE_DIR, backupFileName);

        log(`🚀 Iniciando backup completo (Zstandard)...`);
        log(`📂 Origem: ${SOURCE_DIR}`);
        log(`🎯 Destino: ${targetPath}`);

        if (!fs.existsSync(TARGET_BASE_DIR)) {
            log(`📁 Criando diretório de destino...`);
            fs.mkdirSync(TARGET_BASE_DIR, { recursive: true });
        }

        // Comando para criar o tar.gz
        // -z: compressão gzip
        // -c: criar arquivo
        // -f: nome do arquivo
        // Excluindo node_modules, .git e a própria pasta de backups
        // IMPORTANTE: Incluímos .wwebjs_auth para manter as sessões!
        const excludeFlags = [
            "--exclude='node_modules'",
            "--exclude='.git'",
            "--exclude='backups'",
            "--exclude='*.log'",
            "--exclude='chromium-libs'" // Pasta pesada que pode ser reinstalada se necessário
        ].join(' ');

        log(`📦 Compactando e comprimindo arquivos com Zstd...`);
        const command = `tar --zstd -cf "${targetPath}" ${excludeFlags} -C "${SOURCE_DIR}" .`;

        execSync(command, { stdio: 'inherit' });

        const stats = fs.statSync(targetPath);
        const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);

        log(`✅ Sucesso! Backup salvo em: ${targetPath} (${sizeInMB} MB)`);

        // Rotação de backups
        log(`🧹 Verificando rotação de backups (Limite: ${MAX_BACKUPS})...`);
        const files = fs.readdirSync(TARGET_BASE_DIR)
            .filter(f => f.startsWith('backup_full_') && (f.endsWith('.tar.zst') || f.endsWith('.tar.gz')))
            .map(f => ({
                name: f,
                time: fs.statSync(path.join(TARGET_BASE_DIR, f)).mtime.getTime()
            }))
            .sort((a, b) => b.time - a.time); // Do mais novo para o mais antigo

        if (files.length > MAX_BACKUPS) {
            const filesToDelete = files.slice(MAX_BACKUPS);
            filesToDelete.forEach(f => {
                const filePath = path.join(TARGET_BASE_DIR, f.name);
                fs.unlinkSync(filePath);
                log(`[ROTATION] Removido backup antigo: ${f.name}`);
            });
        }

    } catch (error) {
        log(`❌ Erro detectado: ${error.message}`);
        process.exit(1);
    }
}

runBackup();
