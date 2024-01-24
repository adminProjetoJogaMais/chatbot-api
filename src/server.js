const express = require('express');
const routes = require('./routes');
var http = require('http');
const swaggerUi = require('swagger-ui-express');
const swaggerConfig = require('./utils/swagger-config.json');
require('dotenv').config();
require('./database');

const authController = require('./controllers/AuthenticationController');


function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
        default:
            throw error;
    }
}

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    console.log('Listening on ' + bind);
}

const app = express();

app.use(express.json());

app.use('/index.html', swaggerUi.serve, swaggerUi.setup(swaggerConfig));

app.post('/api/login', authController.login);

app.use(authController.authenticate);

app.use('/api', routes);

var server = http.createServer(app);

server.listen(8080);
server.on('error', onError);
server.on('listening', onListening);