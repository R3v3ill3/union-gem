module.exports = {
  apps: [{
    name: 'union-campaign-planner',
    script: '/usr/bin/npm',
    args: 'run dev',
    cwd: '/var/www/campaign-planner/union-gem',
    watch: false,
    env: {
      NODE_ENV: 'development',
      PORT: 5250,
      HOST: true,
      PATH: '/usr/local/bin:/usr/bin:/bin'
    },
    out_file: '/var/www/campaign-planner/union-gem/logs/out.log',
    error_file: '/var/www/campaign-planner/union-gem/logs/error.log',
    log_file: '/var/www/campaign-planner/union-gem/logs/combined.log',
    combine_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
};