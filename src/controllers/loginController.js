exports.index = (req, res) => {
    res.render('login');
};

exports.login = (req, res) => {
    const { email, password } = req.body;
    
    // Aqui você pode adicionar a lógica de verificação do e-mail e senha (normalmente com um banco de dados)
    if (email === "usuario@example.com" && password === "senha123") {
      res.redirect('/agenda');  // Se o login for bem-sucedido, redireciona para a agenda
    } else {
      res.redirect('/login');  // Caso contrário, volta para a tela de login
    }
  };