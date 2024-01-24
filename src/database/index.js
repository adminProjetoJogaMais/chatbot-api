const env = process.env.NODE_ENV || 'development';
const Sequelize = require('sequelize');
const config = require(__dirname + '/config.json')[env];

const Usuario = require('../models/Usuario');
const Time = require('../models/Time');
const BloquearData = require('../models/BloquearData');
const Jogo = require('../models/Jogo');
const Programacao = require('../models/Programacao');
const Endereco = require('../models/Endereco');

let sequelize;
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
}

Usuario.init(sequelize);
Time.init(sequelize);
BloquearData.init(sequelize);
Jogo.init(sequelize);
Programacao.init(sequelize);
Endereco.init(sequelize);

Usuario.associate(sequelize.models);
Time.associate(sequelize.models);
BloquearData.associate(sequelize.models);
Jogo.associate(sequelize.models);
Programacao.associate(sequelize.models);
Endereco.associate(sequelize.models);

module.exports = sequelize;