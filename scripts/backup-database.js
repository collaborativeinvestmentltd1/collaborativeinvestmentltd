// scripts/backup-database.js
require('dotenv').config();
const { backupDatabase } = require('../database');
const logger = require('../utils/logger');

async function runBackup() {
    try {
        logger.info('🔄 Starting manual database backup...');
        const result = await backupDatabase();
        
        if (result.success) {
            logger.info(`✅ Backup completed successfully: ${result.backupPath}`);
            process.exit(0);
        } else {
            logger.error(`❌ Backup failed: ${result.error}`);
            process.exit(1);
        }
    } catch (error) {
        logger.error('❌ Backup script error:', error.message);
        process.exit(1);
    }
}

runBackup();