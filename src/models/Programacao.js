const { Model, DataTypes } = require('sequelize');

class Programacao extends Model {
    static init(sequelize) {
        super.init({
            id_programacao: {
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
            id_time: {
                type: DataTypes.STRING(32),
                allowNull: false,
                references: {
                    model: 'time',
                    key: 'id_time'
                }
            },
            dia: {
                type: DataTypes.STRING(32),
                allowNull: false
            },
            hora_inicio: {
                type: DataTypes.TIME,
                allowNull: false
            },
            hora_fim: {
                type: DataTypes.TIME,
                allowNull: false
            },
            visitante: {
                type: DataTypes.TINYINT(4),
                allowNull: true
            }
        }, {
            sequelize,
            tableName: 'programacao'
        })
    }

    static associate(models) {
        this.belongsTo(models.Time, { foreignKey: 'id_time', as: 'time' });
    }
}

module.exports = Programacao;