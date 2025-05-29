module.exports = {
  apps: [{
    name: 'union-campaign-planner',
    script: 'npm',
    args: 'run dev',
    cwd: '/var/www/campaign-planner/union-gem',
    watch: false,
    env: {
      NODE_ENV: 'development',
      PORT: 5250,
      HOST: true
    },
    out_file: '/home/troy/.pm2/logs/union-campaign-planner-out.log',
    error_file: '/home/troy/.pm2/logs/union-campaign-planner-error.log',
    combine_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
};