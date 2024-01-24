const { Model, DataTypes } = require('sequelize');

class Endereco extends Model {
    static init(sequelize) {
        super.init({
            id_endereco: {
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
            cep: {
                type: DataTypes.STRING(50),
                allowNull: false
            },
            latitude: {
                type: DataTypes.STRING(50),
                allowNull: true
            },
            longitude: {
                type: DataTypes.STRING(50),
                allowNull: true
            },
            logradouro: {
                type: DataTypes.STRING(50),
                allowNull: false
            },
            numero: {
                type: DataTypes.STRING(50),
                allowNull: false
            },
            complemento: {
                type: DataTypes.STRING(50),
                allowNull: true
            },
            bairro: {
                type: DataTypes.STRING(50),
                allowNull: true
            },
            cidade: {
                type: DataTypes.STRING(50),
                allowNull: false
            },
            UF: {
                type: DataTypes.STRING(2),
                allowNull: false
            },
            titulo: {
                type: DataTypes.STRING(50),
                allowNull: true
            },
            regiao: {
                type: DataTypes.STRING(50),
                allowNull: true
            },
            subregiao: {
                type: DataTypes.STRING(30),
                allowNull: true
            },
        }, {
            sequelize,
            tableName: 'endereco'
        })
    }

    static associate(models) {
        this.hasMany(models.Time, { foreignKey: 'id_endereco', as: 'times' });
    }
}

module.exports = Endereco;