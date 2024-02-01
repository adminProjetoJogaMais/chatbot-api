const { v4 } = require('uuid')
const Jogo = require('../models/Jogo');

const generateUuid = () => v4().replaceAll("-", "").slice(0, 32);

exports.create = async (req, res) => {
    try {
        const { id_time_1, id_time_2, data_hora, id_time_convite } = req.body;

        if (!id_time_1 || !id_time_2 || !data_hora || !id_time_convite) {
            return res.status(400).json({
                status: 'failed',
                message: 'please provide all the required fields: id_time_1, id_time_2, data_hora, id_time_convite'
            });
        };

        const id_jogo = generateUuid();

        const jogo = await Jogo.create({
            id_jogo,
            id_time_1,
            id_time_2,
            data_hora,
            id_time_convite,
            status: 'esperando',
            mandante: 1
        });

        return res.json(jogo);
    } catch (e) {
        res.status(500).json({
            status: 'failed',
            error: e.toString()
        });
    }
}

exports.getJogo = async (req, res) => {
    try {
        const { id_jogo } = req.params;

        const jogo = await Jogo.findByPk(id_jogo, {
            attributes: ['id_time_1', 'id_time_2', 'data_hora', 'status'],
            include: {
                association: 'time1',
                include: {
                    association: 'endereco',
                    attributes: ['cep', 'logradouro', 'numero', 'complemento', 'bairro', 'cidade', 'uf', 'titulo', 'regiao', 'subregiao']
                }
            }
        });

        if (!jogo) return res.status(400).json({
            status: 'failed',
            message: 'cannot find game with provided id'
        });

        var jogoFormatted = jogo.toJSON();
        jogoFormatted.endereco = jogoFormatted.time1.endereco;
        delete jogoFormatted.time1;

        return res.json(jogoFormatted);
    } catch (e) {
        res.status(500).json({
            status: 'failed',
            error: e.toString()
        });
    }
}