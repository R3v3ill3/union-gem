module.exports = {
  apps: [{
    name: 'enviro-gem',
    script: 'npm',
    args: 'run dev',
    cwd: '/var/www/campaign-planner/enviro-gem',
    watch: false,
    env: {
      NODE_ENV: 'development',
      PORT: 5175,
      HOST: true
    },
    out_file: '/home/troy/.pm2/logs/enviro-gem-out.log',
    error_file: '/home/troy/.pm2/logs/enviro-gem-error.log',
    combine_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
};