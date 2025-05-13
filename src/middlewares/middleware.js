const csrf = require('csurf');  // Importação do csurf

// Middleware para verificar erro CSRF
exports.checkCsrfError = (err, req, res, next) => {
  if (err && err.code === 'EBADCSRFTOKEN') {
    req.flash('errors', 'Token CSRF inválido. Por favor, tente novamente.');
    return res.redirect(req.get('Referer') || '/');  // Redireciona para a página anterior ou página inicial
  }
  next();
};

// Middleware de CSRF
exports.csrfMiddleware = csrf();  // Inicializa o CSRF middleware

// Middleware para adicionar o token CSRF nas variáveis locais da resposta
exports.addCsrfToken = (req, res, next) => {
  res.locals.csrfToken = req.csrfToken();  // Gera o token CSRF
  next();
};

// Middleware global para adicionar variáveis gerais à resposta
exports.middlewareGlobal = (req, res, next) => {
  res.locals.umaVariavelLocal = 'Formulário';

  res.locals.user = req.session.user || null; // <- Isso garante que user sempre exista, mesmo que seja null

  res.locals.errors = req.flash('errors');
  res.locals.success = req.flash('success');

  next();
};

// Middleware de autenticação - Verifica se o usuário está logado
exports.checkAuthentication = (req, res, next) => {
  if (!req.session.user) {  // Se não houver usuário na sessão
    req.flash('errors', 'Você precisa estar logado para acessar essa página.');
    return res.redirect('/login');  // Redireciona para a página de login
  }
  next();  // Se o usuário estiver logado, continua para a próxima etapa
};

// Middleware vazio para uso genérico (se necessário em outras rotas)
exports.middleware = (req, res, next) => {
  next();
};
