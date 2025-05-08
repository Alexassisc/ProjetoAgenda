const express = require('express');
const route = express.Router();
const loginController = require('./src/controllers/loginController');
const homeController = require('./src/controllers/homeController');
const registraController = require('./src/controllers/registraController')
// Rotas da home
route.get('/', homeController.index)


//Rotas de login
route.get('/login', loginController.index);
route.post('/login', loginController.login);

//Rota para criação de conta
route.get('/registra', registraController.index);
route.post('/registra', registraController.create);

module.exports = route;
