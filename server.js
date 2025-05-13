require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const route = require('./routes');
const { middlewareGlobal, checkCsrfError, addCsrfToken, csrfMiddleware } = require('./src/middlewares/middleware');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const helmet = require('helmet');
const csrf = require('csurf');


const connectionString = process.env.MONGO_CONNECTION;

// Conectar ao MongoDB e iniciar o servidor após a conexão
mongoose.connect(connectionString)
  .then(() => {
    console.log('✅ Conectado ao MongoDB');

    // Middlewares
    app.use(helmet());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static(path.resolve(__dirname, 'public')));

    // Configuração da sessão
    const sessionOptions = session({
      secret: process.env.SESSION_SECRET,
      store: MongoStore.create({
        mongoUrl: process.env.MONGO_CONNECTION,
      }),
      resave: false, 
      saveUninitialized: false,
      cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            httpOnly: true,
            sameSite: 'lax',
            secure: false // deixe como false em localhost
            }
    });

    // Usando middlewares
    app.use(sessionOptions);
    app.use(flash());

    app.use(csrf());  // Inicializa o CSRF protection
    app.use(checkCsrfError);  // Lida com erros de CSRF
    app.use(csrfMiddleware);  // Middleware do CSRF
    app.use(addCsrfToken);  // Adiciona o CSRF token à resposta

    
    // Definindo a view engine (EJS) e onde estão as views
    app.set('views', path.resolve(__dirname, 'src', 'views'));
    app.set('view engine', 'ejs');

    // Usando o middleware global
    app.use(middlewareGlobal);

    // Definindo as rotas
    app.use(route);

    // Iniciando o servidor
    app.listen(3000, () => {
      console.log('🚀 Servidor rodando em http://localhost:3000');
    });
  })
  .catch(err => {
    console.error('❌ Erro ao conectar no MongoDB:', err);
  });