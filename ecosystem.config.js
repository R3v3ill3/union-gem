module.exports = {
  apps: [{
    name: 'union-campaign-planner',
    script: 'npm',
    args: 'run dev',
    cwd: './home/project',
    watch: false,
    env: {
      NODE_ENV: 'development',
      PORT: 5250,
      HOST: true
    },
    out_file: './logs/out.log',
    error_file: './logs/error.log',
    log_file: './logs/combined.log',
    time: true,
    combine_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
};