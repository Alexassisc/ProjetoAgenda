// src/controllers/registraController.js
const Login = require('../models/LoginModel');  // Agora estamos usando a classe Login
const bcrypt = require('bcryptjs');

exports.index = (req, res) => {
  res.render('registra', {
    errors: req.flash('errors'),
    success: req.flash('success'),
  });
};

exports.create = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    req.flash('errors', 'As senhas não coincidem');
    return res.redirect('/registra');
  }

  try {
    // Criando uma instância da classe Login
    const login = new Login({ email, password, name });
    
    // Chamando o método de registro
    await login.register();
    
    if (login.errors.length > 0) {
      // Caso haja erros, flash them e redireciona
      req.flash('errors', login.errors);
      return res.redirect('/registra');
    }

    // Caso não haja erros, flash success e redireciona para login
    req.flash('success', 'Conta criada com sucesso! Faça login.');
    res.redirect('/login');
  } catch (error) {
    console.error(error);
    req.flash('errors', 'Ocorreu um erro ao criar a conta');
    res.redirect('/registra');
  }
};
