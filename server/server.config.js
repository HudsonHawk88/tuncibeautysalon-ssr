// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);


// const config = {
//     max_memory_restart: '2048M',
//     apps: [
//         {
//             name: 'tbs',
//             script: path.resolve(__dirname, 'bundle.cjs'),
//             instances: 'max',
//             exec_mode: 'cluster'
//         }
//     ],
//     env: {
//         NODE_ENV: 'production',
//         PORT: 7000,
//         HOST: '127.0.0.1' // default
//     }
// }

// export default config


const path = require('path');

module.exports = {
    max_memory_restart: '2048M',
    apps: [
        {
            name: 'tbs',
            script: path.resolve(__dirname, 'bundle.cjs'),
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
