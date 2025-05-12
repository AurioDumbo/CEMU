const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LoginLog = sequelize.define('LoginLog', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  loginAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  }
}, {
  tableName: 'login_logs',
  timestamps: false,
});

module.exports = LoginLog;
