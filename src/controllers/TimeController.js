const moment = require('moment');
const { Op } = require('sequelize');
const sequelize = require('sequelize');
const Time = require('../models/Time');
const { DaysOfWeek } = require('../utils/Enums')

exports.getTimeFreeDates = async (req, res) => {
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
                {
                    association: 'programacoes',
                    required: false
                },
            ]
        });

        if (!team) return res.status(400).json({
            status: 'failed',
            message: 'cannot find team with provided id'
        });

        const teamsBusyDates = team.bloquearDatas.concat(team.jogosMandante, team.jogosVisitante).map(e => e.toJSON().data);

        const teamsProgramacoes = team.programacoes.map(e => {
            return {
                dia: e.toJSON().dia,
                hora_inicio: e.toJSON().hora_inicio,
                hora_fim: e.toJSON().hora_fim
            }
        });

        const teamsFreeDays = [];

        for (var i = 0; i < 60; i++) {
            var date = dateFrom.add(1, 'day');

            const dayOfWeek = DaysOfWeek[date.day()];

            const teamsProgramacaoForTheDay = teamsProgramacoes.find(e => e.dia === dayOfWeek);

            if (!teamsBusyDates.includes(date.format('YYYY-MM-DD')) && teamsProgramacaoForTheDay) {
                teamsFreeDays.push({
                    data: date.format('YYYY/MM/DD'),
                    hora_inicio: teamsProgramacaoForTheDay.hora_inicio,
                    hora_fim: teamsProgramacaoForTheDay.hora_fim
                })
            }

        }
        return res.json(teamsFreeDays);
    } catch (e) {
        res.status(500).json({
            status: 'failed',
            error: e.toString()
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
            error: e.toString()
        });
    }
}

exports.getTimesAvailableAt = async (req, res) => {
    try {
        var { id_time, data, hora_inicio, hora_fim, genero, modalidade, uf, subregiao_order_by, page } = req.query;

        if (!id_time || !data || !hora_inicio || !hora_fim || !genero || !modalidade || !uf) {
            return res.status(400).json({
                status: 'failed',
                message: 'please provide all the required fields: id_time, data, hora_inicio, hora_fim, genero, modalidade, uf'
            });
        };

        const availableTeams = [];
        var offset = page ? (page - 1) * 3 : 0;
        var shouldReturnTeamsWithGamesAgainstRequester = false;
        while (availableTeams.length < 3) {
            var teams = await getAvailableTeams(req.query, shouldReturnTeamsWithGamesAgainstRequester, offset);

            teams.forEach(e => {
                if (!e.bloquearDatas.length && !e.jogosMandante.length && availableTeams.length < 3) availableTeams.push(e);
            });

            //there are no available teams - return empty result
            if (!teams.length && shouldReturnTeamsWithGamesAgainstRequester) {
                break;
            }
            //there are no available teams that havnt played requester team yet - 
            //search for available teams that have already played against requester
            else if (!teams.length && !shouldReturnTeamsWithGamesAgainstRequester) {
                shouldReturnTeamsWithGamesAgainstRequester = true;
                teams = await getAvailableTeams(req.query, shouldReturnTeamsWithGamesAgainstRequester, offset);
            };

            offset += 3;
        }

        const availableTeamsFormatted = returnTeamsFormatted(availableTeams, subregiao_order_by);

        return res.json(availableTeamsFormatted);
    } catch (e) {
        res.status(500).json({
            status: 'failed',
            error: e.toString()
        });
    }
}

const getAvailableTeams = async (params, shouldReturnTeamsWithGamesAgainstRequester, offset) => {
    var { id_time, data, hora_inicio, hora_fim, genero, modalidade, uf } = params;

    const parsedDate = moment(data);
    const day = parsedDate.format('YYYY/MM/DD');
    const dayOfWeek = DaysOfWeek[parsedDate.day()];
    const dayMinusOneMonth = parsedDate.subtract(1, 'months').format('YYYY/MM/DD');

    return await Time.findAll({
        where: {
            genero: genero,
            modalidade: modalidade,
            ativo: 1
        },
        include: [
            {
                association: 'bloquearDatas',
                as: 'bloquearDatas',
                where: {
                    data: day
                },
                required: false,
            },
            {
                association: 'jogosMandante',
                where: returnJogosMandanteWhereObj(id_time, dayMinusOneMonth, day, shouldReturnTeamsWithGamesAgainstRequester),
                attributes: ['data_hora'],
                required: false
            },
            {
                association: 'programacoes',
                where: {
                    dia: dayOfWeek,
                    visitante: 0,
                    hora_inicio: { [Op.between]: [hora_inicio, hora_fim] }
                },
                attributes: ['hora_inicio'],
            },
            {
                association: 'endereco',
                where: {
                    UF: uf
                },
                attributes: ['cidade', 'bairro', 'logradouro', 'numero', 'titulo']
            }
        ],
        offset: offset,
        limit: 3,
        attributes: ['id_time', 'nome'],
    })
}

const returnJogosMandanteWhereObj = (id_time, dateFrom, date, shouldReturnTeamsWithGamesAgainstRequester) => {
    if (!shouldReturnTeamsWithGamesAgainstRequester) {
        return {
            [Op.or]: [
                //if team already have a game at the date
                {
                    data_hora: {
                        [Op.and]: {
                            [Op.gte]: date + ' 00:00:00',
                            [Op.lte]: date + ' 23:59:59.999999',
                        }
                    }
                },
                //if team has already played against the team making the request in the past 30 days
                {
                    data_hora: { [Op.between]: [dateFrom + ' 00:00:00', date + ' 00:00:00'] },
                    [Op.or]: [
                        { id_time_1: id_time },
                        { id_time_2: id_time },
                    ]
                }
            ],
            status: { [Op.ne]: 'recusado' }
        }
    } else {
        return {
            //if team already have a game at the date
            data_hora: {
                [Op.and]: {
                    [Op.gte]: date + ' 00:00:00',
                    [Op.lte]: date + ' 23:59:59.999999',
                }
            }
        }
    }
}

const returnTeamsFormatted = (teams, subregiao_order_by) => {
    var teamsFormatted = teams.map(e => {
        const formattedObj = e.toJSON();

        delete formattedObj.bloquearDatas;
        delete formattedObj.jogosMandante;
        delete formattedObj.jogosVisitante;

        return formattedObj;
    });

    if (subregiao_order_by) {
        teamsFormatted.sort((a, b) => {
            if (a.endereco.subregiao === subregiao_order_by && b.endereco.subregiao !== subregiao_order_by) return -1;
            else return 0;
        })
    }

    return teamsFormatted;
}