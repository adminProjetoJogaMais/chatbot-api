const moment = require('moment');
const { Op } = require('sequelize');
const sequelize = require('sequelize');
const Time = require('../models/Time');
const { DaysOfWeek } = require('../utils/Enums')

exports.getTimeBusyDates = async (req, res) => {
    try {
        const { id_time } = req.params;

        const dateFrom = moment();
        const dateTo = moment().add(60, 'days');

        const team = await Time.findByPk(id_time, {
            include: [
                {
                    association: 'bloquearDatas',
                    where: {
                        data: { [Op.between]: [dateFrom, dateTo] }
                    },
                    attributes: ['data'],
                    required: false
                },
                {
                    association: 'jogosMandante',
                    where: {
                        data_hora: { [Op.between]: [dateFrom, dateTo] },
                        status: { [Op.ne]: 'recusado' }
                    },
                    attributes: [[sequelize.fn('date_format', sequelize.col('jogosMandante.data_hora'), '%Y-%m-%d'), 'data']],
                    required: false
                },
                {
                    association: 'jogosVisitante',
                    where: {
                        data_hora: { [Op.between]: [dateFrom, dateTo] },
                        status: { [Op.ne]: 'recusado' }
                    },
                    attributes: [[sequelize.fn('date_format', sequelize.col('jogosVisitante.data_hora'), '%Y-%m-%d'), 'data']],
                    required: false
                },
            ]
        });

        if (!team) return res.status(400).json({
            status: 'failed',
            message: 'cannot find team with provided id'
        });

        const teamsBusyDates = team.bloquearDatas.concat(team.jogosMandante, team.jogosVisitante);
        const teamsBusyDatesFormatted = teamsBusyDates.map(e => e.toJSON().data);

        return res.json(teamsBusyDatesFormatted);
    } catch (e) {
        res.status(500).json({
            status: 'failed',
            error: e
        });
    }
}

exports.getTimesAvailableAt = async (req, res) => {
    try {
        const { data, genero, modalidade, uf, visitante, subregiao_order_by } = req.query;

        if (!data || !genero || !modalidade || !uf || visitante === null || visitante === undefined) {
            return res.status(400).json({
                status: 'failed',
                message: 'please provide all the required fields: data, genero, modalidade, uf, visitante'
            });
        };

        const parsedDate = moment(data);
        const day = parsedDate.format('YYYY/MM/DD');
        const dayOfWeek = DaysOfWeek[parsedDate.day() + 1];
        const time = parsedDate.format('HH:mm') + ':00';

        const teams = await Time.findAll({
            where: {
                genero: genero,
                modalidade: modalidade,
                ativo: 1
            },
            attributes: ['id_time', 'nome', 'sigla'],
            include: [
                {
                    association: 'bloquearDatas',
                    where: {
                        data: day
                    },
                    required: false
                },
                {
                    association: 'jogosMandante',
                    where: {
                        data_hora: {
                            [Op.and]: {
                                [Op.gte]: day + ' 00:00:00',
                                [Op.lte]: day + ' 23:59:59.999999',
                            }
                        },
                        status: { [Op.ne]: 'recusado' }
                    },
                    attributes: ['data_hora'],
                    required: false
                },
                {
                    association: 'jogosVisitante',
                    where: {
                        data_hora: {
                            [Op.and]: {
                                [Op.gte]: day + ' 00:00:00',
                                [Op.lte]: day + ' 23:59:59.999999',
                            }
                        },
                        status: { [Op.ne]: 'recusado' }
                    },
                    attributes: ['data_hora'],
                    required: false
                },
                {
                    association: 'programacoes',
                    where: {
                        dia: dayOfWeek,
                        visitante: visitante,
                        hora_inicio: { [Op.lte]: time },
                        hora_fim: { [Op.gte]: time },
                    }
                },
                {
                    association: 'endereco',
                    where: {
                        UF: uf
                    },
                    attributes: ['cidade', 'bairro', 'regiao', 'subregiao']
                }
            ],
        });

        const availableTeams = teams.filter(e => {
            return !e.bloquearDatas.length && !e.jogosMandante.length && !e.jogosVisitante.length;
        });

        const availableTeamsFormatted = availableTeams.map(e => {
            const formattedObj = e.toJSON();

            delete formattedObj.bloquearDatas;
            delete formattedObj.jogosMandante;
            delete formattedObj.jogosVisitante;
            delete formattedObj.programacoes;

            return formattedObj;
        });

        availableTeamsFormatted.sort((a, b) => {
            if (a.endereco.subregiao === subregiao_order_by && b.endereco.subregiao !== subregiao_order_by) return -1;
            else return 0;
        })

        return res.json(availableTeamsFormatted);
    } catch (e) {
        res.status(500).json({
            status: 'failed',
            error: e
        });
    }
}

exports.getTimeJogos = async (req, res) => {
    try {
        const { id_time } = req.params;
        const { dataFrom, dataTo } = req.query;

        if (!dataFrom || !dataTo) return res.status(400).json({
            status: 'failed',
            message: 'please provide dataFrom and dataTo'
        });

        const team = await Time.findByPk(id_time, {
            include: [
                {
                    association: 'jogosMandante',
                    where: {
                        data_hora: { [Op.between]: [dataFrom, dataTo] },
                    },
                    required: false
                },
                {
                    association: 'jogosVisitante',
                    where: {
                        data_hora: { [Op.between]: [dataFrom, dataTo] },
                    },
                    required: false
                },
            ]
        });

        if (!team) return res.status(400).json({
            status: 'failed',
            message: 'cannot find team with provided id'
        });

        const teamsJogos = team.jogosMandante.concat(team.jogosVisitante);

        return res.json(teamsJogos);
    } catch (e) {
        res.status(500).json({
            status: 'failed',
            error: e
        });
    }
}