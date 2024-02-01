const Usuario = require('../models/Usuario');

// add cpf field and comment
exports.getUserByCellphone = async (req, res) => {
    try {
        const { cell } = req.query;

        if (!cell) return res.status(400).json({
            status: 'failed',
            message: 'please provide a cellphone'
        });

        const user = await Usuario.findOne({
            where: { cel: cell },
            include: {
                association: 'times',
                attributes: ['id_time', 'nome', 'sigla', 'genero', 'modalidade', 'perfil_time_campo'],
                through: { attributes: [] },
                include: {
                    association: 'endereco',
                    attributes: ['uf', 'subregiao'],
                }
            },
            attributes: ['id_usuario', 'nome', 'email', 'cel', 'data_nasc']
        });

        return res.json(user);
    } catch (e) {
        res.status(500).json({
            status: 'failed',
            error: e.toString()
        });
    }
}