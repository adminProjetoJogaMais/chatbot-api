const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Joga+ Chatbot API',
    description: ''
  },
  host: 'http://3.23.79.231:8080',
  basePath: '/api',
  securityDefinitions: {
    bearerAuth: {
      name: "Authorization",
      in: "header",
      type: "apiKey",
      description: "JWT Authorization header"
    }
  },
  security: [ { "bearerAuth": [] } ],
};

const outputFile = './swagger-config.json';
const routes = ['../routes.js'];

swaggerAutogen(outputFile, routes, doc);