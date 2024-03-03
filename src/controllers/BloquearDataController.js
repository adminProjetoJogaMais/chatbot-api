const { v4 } = require('uuid')
const BloquearData = require('../models/BloquearData');

const generateUuid = () => v4().replaceAll("-", "").slice(0, 32);

exports.create = async (req, res) => {
    try {
        const { id_time, data } = req.body;

        if (!id_time || !data) {
            return res.status(400).json({
                status: 'failed',
                message: 'please provide all the required fields: id_time, data'
            });
        };

        const id_bloquear_data = generateUuid();
        
        const bloquearData = await BloquearData.create({
            id_bloquear_data,
            id_time,
            data,
            punicao: 0
        })

        return res.json(bloquearData);
    } catch (e) {
        res.status(500).json({
            status: 'failed',
            error: e.toString()
        });
    }
}