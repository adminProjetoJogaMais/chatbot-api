const express = require('express');

const usuarioController = require('./controllers/UsuarioController');
const timeController = require('./controllers/TimeController');
const jogoController = require('./controllers/JogoController');
const bloquearDataController = require('./controllers/BloquearDataController');
const authController = require('./controllers/AuthenticationController');

const routes = express.Router();

routes.post('/login', authController.login);

routes.get('/userbycellphone', usuarioController.getUserByCellphone);

routes.get('/teams/:id_time/freedays', timeController.getTimeFreeDates);

routes.get('/teams/:id_time/games', timeController.getTimeJogos);

routes.get('/teamsavailableat', timeController.getTimesAvailableAt);

routes.get('/game/:id_jogo', jogoController.getJogo);

routes.post('/game', jogoController.create);

routes.post('/bloqueardata', bloquearDataController.create);

module.exports = routes;