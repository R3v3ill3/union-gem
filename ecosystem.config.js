module.exports = {
  apps: [{
    name: 'campaign-planner',
    script: 'npm',
    args: 'run dev',
    cwd: '/home/project',
    watch: false,
    env: {
      NODE_ENV: 'development',
      PORT: 5174,
      HOST: true
    },
    out_file: '/home/project/logs/out.log',
    error_file: '/home/project/logs/error.log',
    log_file: '/home/project/logs/combined.log',
    time: true,
    combine_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
};