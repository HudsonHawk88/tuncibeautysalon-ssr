const path = require('path');
// const os = require("os")
// const Cpus = os.cpus();

module.exports = {
    max_memory_restart: '2048M',
    apps: [
        {
            name: 'cron',
            script: path.resolve(__dirname, 'bundle.js'),
            instances: '1',
            exec_mode: 'cluster',

            env_development: {
                NODE_ENV: 'development',
                PORT: 8081,
                HOST: '192.168.1.76', // default
            },
            env_production: { 
                NODE_ENV: 'production',
                PORT: 7001,
                HOST: '127.0.0.1', // default
            }
        },
        {
            name: 'tbs',
            script: path.resolve(__dirname, 'bundle.js'),
            instances: `-1`,
            exec_mode: 'cluster',
            env_development: {
                NODE_ENV: 'development',
                PORT: 8080,
                HOST: '192.168.1.76', // default
            },
            env_production: {
                NODE_ENV: 'production',
                PORT: 7000,
                HOST: '127.0.0.1', // default
            }
        }
    ],
    
};
