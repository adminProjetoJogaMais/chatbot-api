const { Model, DataTypes } = require('sequelize');

class BloquearData extends Model {
    static init(sequelize) {
        super.init({
            id_bloquear_data: {
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
                allowNull: true,
                references: {
                    model: 'time',
                    key: 'id_time'
                }
            },
            data: {
                type: DataTypes.DATE,
                allowNull: false
            },
            punicao: {
                type: DataTypes.TINYINT,
                allowNull: true,
                defaultValue: 0
            }
        }, {
            sequelize,
            tableName: 'bloquear_data'
        })
    }

    static associate(models) {
        this.belongsTo(models.Time, { foreignKey: 'id_time', as: 'time' });
    }
}

module.exports = BloquearData;