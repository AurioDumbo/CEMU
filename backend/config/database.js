const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME || 'cemu', 
    process.env.DB_USER || 'root', 
    process.env.DB_PASSWORD || 'root',
    {
        host: process.env.DB_HOST || 'localhost', 
        dialect: 'mysql', 
    }
);

module.exports = sequelize;