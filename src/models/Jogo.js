const { Model, DataTypes } = require('sequelize');

class Jogo extends Model {
    static init(sequelize) {
        super.init({
            id_jogo: {
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
            id_time_1: {
                type: DataTypes.STRING(32),
                allowNull: false,
                references: {
                    model: 'time',
                    key: 'id_time'
                }
            },
            id_time_2: {
                type: DataTypes.STRING(32),
                allowNull: false,
                references: {
                    model: 'time',
                    key: 'id_time'
                }
            },
            data_hora: {
                type: DataTypes.DATE,
                allowNull: false
            },
            status: {
                type: DataTypes.STRING(45),
                allowNull: false
            },
            gols_time_1_quadro_1: {
                type: DataTypes.INTEGER(11),
                allowNull: true
            },
            gols_time_2_quadro_1: {
                type: DataTypes.INTEGER(11),
                allowNull: true
            },
            gols_time_1_quadro_2: {
                type: DataTypes.INTEGER(11),
                allowNull: true
            },
            gols_time_2_quadro_2: {
                type: DataTypes.INTEGER(11),
                allowNull: true
            },
            obs: {
                type: DataTypes.TEXT,
                allowNull: true
            }
        }, {
            sequelize,
            tableName: 'jogo'
        })
    }

    static associate(models) {
        this.belongsTo(models.Time, { foreignKey: 'id_time_1', as: 'time1' });
        this.belongsTo(models.Time, { foreignKey: 'id_time_2', as: 'time2' });
    }
}

module.exports = Jogo;