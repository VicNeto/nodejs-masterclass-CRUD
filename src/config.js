
let environments = {};

environments.staging = {
    httpPort: process.env.PORT || 3001,
    httpsPort: process.env.PORT || 3002,
    envName: 'staging',
};

environments.production = {
    httpPort: process.env.PORT || 5001,
    httpsPort: process.env.PORT || 5002,
    envName: 'production',
};

const currentEnv = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.toLocaleLowerCase() : '';

const envToExport = environments.hasOwnProperty(currentEnv) ? environments[currentEnv] : environments.staging;

module.exports = envToExport;