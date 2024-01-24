const { Model, DataTypes } = require('sequelize');

class Usuario extends Model {
  static init(sequelize) {
    super.init({
      id_usuario: {
        type: DataTypes.STRING(32),
        allowNull: false,
        primaryKey: true
      },
      seq: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        unique: true
      },
      id_endereco: {
        type: DataTypes.STRING(32),
        allowNull: true,
        references: {
          model: 'endereco',
          key: 'id_endereco'
        }
      },
      nome: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      email: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      cel: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      data_nasc: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      foto_perfil: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      senha: {
        type: DataTypes.STRING(250),
        allowNull: false
      },
      ativo: {
        type: DataTypes.INTEGER(4),
        allowNull: false
      }
    }, {
      sequelize,
      tableName: 'usuario'
    })
  }

  static associate(models) {
    this.belongsToMany(models.Time, { foreignKey: 'id_usuario', through: 'usuario_time', as: 'times' });
  }
}

module.exports = Usuario;