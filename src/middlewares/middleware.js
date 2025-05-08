const csrf = require('csurf');  // Adicionando a importação do csurf

// Middleware para verificar erro CSRF
exports.checkCsrfError = (err, req, res, next) => {
  if (err && err.code === 'EBADCSRFTOKEN') {
    return res.status(403).send('Erro de CSRF: Token inválido.');
  }
  next();
};

// Middleware de CSRF
exports.csrfMiddleware = csrf();  // Aqui estamos usando csrf corretamente agora

// Middleware para adicionar o token CSRF nas variáveis locais da resposta
exports.addCsrfToken = (req, res, next) => {
  res.locals.csrfToken = req.csrfToken();  // Gera o token CSRF
  next();
};

// Outro middleware de exemplo
exports.middlewareGlobal = (req, res, next) => {
  res.locals.umaVariavelLocal = 'Formulário';
  next();
};

