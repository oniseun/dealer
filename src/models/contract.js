const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Contract = sequelize.define(
    'Contract',
    {
      terms: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('new', 'in_progress', 'terminated'),
      },
    },
    {
      modelName: 'Contract',
    }
  );

  Contract.associate = (models) => {
    Contract.belongsTo(models.Profile, { as: 'Contractor' });
    Contract.belongsTo(models.Profile, { as: 'Client' });
    Contract.hasMany(models.Job);
  };

  return Contract;
};
