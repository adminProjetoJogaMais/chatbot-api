const { Model, DataTypes } = require('sequelize');

class Time extends Model {
    static init(sequelize) {
        super.init({
            id_time: {
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
            sigla: {
                type: DataTypes.STRING(5),
                allowNull: false
            },
            fundacao: {
                type: DataTypes.DATEONLY,
                allowNull: false
            },
            foto_escudo: {
                type: DataTypes.STRING(50),
                allowNull: true
            },
            modalidade: {
                type: DataTypes.STRING(45),
                allowNull: true
            },
            genero: {
                type: DataTypes.STRING(45),
                allowNull: true
            },
            perfil_time_campo: {
                type: DataTypes.STRING(45),
                allowNull: true
            },
            perfil_time_quadro: {
                type: DataTypes.STRING(45),
                allowNull: true
            },
            historia_time: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            ativo: {
                type: DataTypes.INTEGER(4),
                allowNull: true
            }
        }, {
            sequelize,
            tableName: 'time'
        })
    }

    static associate(models) {
        this.belongsToMany(models.Usuario, { foreignKey: 'id_time', through: 'usuario_time', as: 'usuarios' });
        this.belongsTo(models.Endereco, { foreignKey: 'id_endereco', as: 'endereco' });
        this.hasMany(models.BloquearData, { foreignKey: 'id_time', as: 'bloquearDatas' });
        this.hasMany(models.Jogo, { foreignKey: 'id_time_1', as: 'jogosMandante' });
        this.hasMany(models.Jogo, { foreignKey: 'id_time_2', as: 'jogosVisitante' });
        this.hasMany(models.Programacao, { foreignKey: 'id_time', as: 'programacoes' });
    }
}

module.exports = Time;