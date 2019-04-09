module.exports = {
  apps : [{
    name: 'Insight',
    script: './server.js',
    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    // args: 'start',
    instances: 0,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_staging: {
      NODE_ENV: 'staging'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],

  deploy : {
    staging : {
      user : 'root',
      host : '165.22.128.229',
      ref  : 'origin/master',
      repo : 'git@github.com:yasirmturk/insight-server.git',
      path : '/root/insight-server',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env staging'
    },
    production : {
      user : 'root',
      host : '165.22.128.229',
      ref  : 'origin/master',
      repo : 'git@github.com:yasirmturk/insight-server.git',
      path : '/root/insight-server',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};
