const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Job = sequelize.define(
    'Job',
    {
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      },
      paid: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      paymentDate: {
        type: DataTypes.DATE,
      },
    },
    {
      modelName: 'Job',
    }
  );

  Job.associate = (models) => {
    Job.belongsTo(models.Contract);
  };

  return Job;
};
