const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Profile = sequelize.define(
    'Profile',
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      profession: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      balance: {
        type: DataTypes.DECIMAL(12, 2),
      },
      type: {
        type: DataTypes.ENUM('client', 'contractor'),
      },
    },
    {
      modelName: 'Profile',
    }
  );

  Profile.associate = (models) => {
    Profile.hasMany(models.Contract, {as :'Contractor', foreignKey:'ContractorId'});
    Profile.hasMany(models.Contract, {as : 'Client', foreignKey:'ClientId'})
  };

  return Profile;
};
