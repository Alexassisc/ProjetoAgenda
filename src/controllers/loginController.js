const Login = require('../models/LoginModel');

exports.index = (req, res) => {
  // Renderiza a página de login com mensagens de erro ou sucesso, se houver
  res.render('login', {
    email: '',  // Inicia o email como vazio
    errors: req.flash('errors'),
    success: req.flash('success')
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const login = new Login({ email, password });

  await login.login();

  if (login.errors.length > 0) {
    req.flash('errors', login.errors);
    return res.render('login', {
      email,
      errors: req.flash('errors'),
      success: req.flash('success')
    });
  }

  req.session.user = login.user;
  
  // 🔥 Aguarde salvar a sessão antes de redirecionar
  req.session.save(() => {
    req.flash('success', 'Login bem-sucedido!');
    res.redirect('/agenda');
  });
};

exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.log('Erro ao destruir a sessão:', err);
      return res.redirect('/agenda');
    }
    res.clearCookie('connect.sid'); // Limpa o cookie da sessão
    res.set('Cache-Control', 'no-store'); // Bloqueia cache
    res.redirect('/login');
  });
};


