// ecosystem.config.js
module.exports = {
    apps: [{
        name: 'cil-website',
        script: 'app.js',
        instances: 'max',
        exec_mode: 'cluster',
        watch: false,
        max_memory_restart: '1G',
        env: {
            NODE_ENV: 'development',
            PORT: 3000
        },
        env_production: {
            NODE_ENV: 'production',
            PORT: 443
        },
        error_file: './logs/pm2-error.log',
        out_file: './logs/pm2-out.log',
        log_file: './logs/pm2-combined.log',
        time: true,
        merge_logs: true,
        log_date_format: 'YYYY-MM-DD HH:mm:ss',
        // Graceful restart
        kill_timeout: 5000,
        listen_timeout: 3000,
        // Auto-restart on crash
        autorestart: true,
        max_restarts: 10,
        restart_delay: 5000,
        // Health check
        // you can add a health check endpoint
    }]
};