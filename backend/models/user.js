const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 

const User = sequelize.define('User', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 3, // 1=Admin, 2=Funcionário, 3=Leitor
    }
}, {
    tableName: 'users', 
    timestamps: true, 
});

module.exports = User;