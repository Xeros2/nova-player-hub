module.exports = {
  apps: [{
    name: 'nova-player-api',
    script: './dist/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: { NODE_ENV: 'production', PORT: 3000 },
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    time: true
  }]
};
