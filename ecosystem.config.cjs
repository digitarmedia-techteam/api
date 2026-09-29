module.exports = {
  apps: [
    {
      name: 'express-api-server',
      script: 'src/server.js',
      instances: 'max', // Utilizes all available CPU cores (cluster mode)
      exec_mode: 'cluster',
      autorestart: true,
      watch: false, // Disabled in production for stability
      max_memory_restart: '500M', // Auto-restart if memory exceeds 500MB
      exp_backoff_restart_delay: 100, // Exponential backoff delay on crashes
      kill_timeout: 5000, // Graceful shutdown window before SIGKILL
      listen_timeout: 8000,
      min_uptime: '10s',
      max_restarts: 10,
      env: {
        NODE_ENV: 'development',
        PORT: 3001,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      // Centralized Logging
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: 'logs/pm2-error.log',
      out_file: 'logs/pm2-out.log',
      merge_logs: true,
    },
  ],
};
