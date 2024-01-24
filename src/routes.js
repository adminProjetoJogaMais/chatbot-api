const express = require('express');

const usuarioController = require('./controllers/UsuarioController');
const timeController = require('./controllers/TimeController');
const jogoController = require('./controllers/JogoController');

const routes = express.Router();

routes.get('/userbycellphone', usuarioController.getUserByCellphone);

routes.get('/teams/:id_time/busydays', timeController.getTimeBusyDates);

routes.get('/teams/:id_time/games', timeController.getTimeJogos);

routes.get('/teamsavailableat', timeController.getTimesAvailableAt);

routes.get('/game/:id_jogo', jogoController.getJogo);

routes.post('/game', jogoController.create);

module.exports = routes;