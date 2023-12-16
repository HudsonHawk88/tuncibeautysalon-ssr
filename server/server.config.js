const path = require('path');

module.exports = {
    max_memory_restart: '2048M',
    apps: [
        {
            name: 'tbs',
            script: path.resolve(__dirname, 'bundle.js'),
            instances: 'max',
            exec_mode: 'cluster'
        }
    ],
    env: {
        NODE_ENV: 'production',
        PORT: 7000,
        HOST: '127.0.0.1' // default
    }
};
