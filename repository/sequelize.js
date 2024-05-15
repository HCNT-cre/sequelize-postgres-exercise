const Sequelize = require("sequelize");

export const getSequelize = async () => {
    const POSTGRES_PASSWORD_KEY = pwKey || process.env.POSTGRES_PASSWORD_KEY || 'postgresPassword';
    const POSTGRES_HOST = host || process.env.POSTGRES_HOST;
    const POSTGRES_PORT = port || process.env.POSTGRES_PORT;
    const POSTGRES_DATABASE = dbName || process.env.POSTGRES_DATABASE;
    const POSTGRES_USERNAME = userName || process.env.POSTGRES_USERNAME;

    const sequelize = new Sequelize(POSTGRES_DATABASE, POSTGRES_USERNAME, POSTGRES_PASSWORD_KEY, {
        host: POSTGRES_HOST,
        dialect: 'postgres',
        port: POSTGRES_PORT,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        operatorsAliases: true
    });

    return sequelize;
}

