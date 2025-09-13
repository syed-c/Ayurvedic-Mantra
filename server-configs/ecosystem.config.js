// PM2 ecosystem configuration for ayurvedicmantra.com
module.exports = {
  apps: [
    {
      name: 'ayurvedicmantra',
      script: 'npm',
      args: 'start',
      cwd: '/path/to/your/app', // Update this path
      instances: 'max', // Use all available CPU cores
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      log_file: '/var/log/ayurvedicmantra/combined.log',
      out_file: '/var/log/ayurvedicmantra/out.log',
      error_file: '/var/log/ayurvedicmantra/error.log',
      time: true,
      
      // Auto-restart settings
      max_memory_restart: '1G',
      restart_delay: 4000,
      
      // Health monitoring
      min_uptime: '10s',
      max_restarts: 10,
      
      // Environment specific config
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      }
    }
  ],
  
  deploy: {
    production: {
      user: 'your-username',
      host: 'your-server-ip',
      ref: 'origin/main',
      repo: 'https://github.com/your-repo/ayurvedicmantra.git',
      path: '/var/www/ayurvedicmantra',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production'
    }
  }
};