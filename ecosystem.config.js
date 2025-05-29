module.exports = {
  apps: [{
    name: 'campaign-planner',
    script: 'npm',
    args: 'run dev',
    cwd: '/var/www/campaign-planner/praxis-enviro',
    watch: false,
    env: {
      NODE_ENV: 'development',
      PORT: 5174,
      HOST: true
    },
    out_file: '/home/troy/.pm2/logs/campaign-planner-out.log',
    error_file: '/home/troy/.pm2/logs/campaign-planner-error.log',
    combine_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
};