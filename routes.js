// routes.js
const express = require('express');
const route = express.Router();

const homeController = require('./src/controllers/homeController');
const loginController = require('./src/controllers/loginController');
const registraController = require('./src/controllers/registraController');
const agendaController = require('./src/controllers/agendaController');

const { middleware, checkAuthentication  } = require('./src/middlewares/middleware');

// Home
route.get('/', homeController.index);

// Login
route.get('/login', loginController.index);
route.post('/login', loginController.login);


// Logout
route.get('/logout', loginController.logout);

// Registro
route.get('/registra', registraController.index);
route.post('/registra', registraController.create);

// Agenda
route.get('/agenda', checkAuthentication, agendaController.index);

// Adicionar
route.get('/agenda/adicionar', checkAuthentication, agendaController.addForm);  // Só acessível se logado
route.post('/agenda/adicionar', checkAuthentication, agendaController.create); // Só acessível se logado

// Editar
route.get('/agenda/editar/:id', checkAuthentication, agendaController.editForm);
route.post('/agenda/editar/:id', checkAuthentication, agendaController.update);

// Excluir
route.post('/agenda/excluir/:id', checkAuthentication, agendaController.delete);

module.exports = route;
