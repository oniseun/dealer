const { Sequelize } = require('sequelize');
const ProfileModel = require('./profile');
const ContractModel = require('./contract');
const JobModel = require('./job');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite3',
});

const models = {
  Profile: ProfileModel(sequelize, Sequelize),
  Contract: ContractModel(sequelize, Sequelize),
  Job: JobModel(sequelize, Sequelize),
};

Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

module.exports = { sequelize, models };
