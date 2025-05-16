const Agenda = require('../models/AgendaModel');

// Exibe todos os contatos
exports.index = async (req, res) => {
  try {
    const contatos = await Agenda.find({}).lean();
    res.render('agenda', { contatos });
  } catch (error) {
    req.flash('errors', 'Erro ao carregar contatos.');
    res.redirect('/');
  }
};

// Exibe formulário para adicionar novo contato
exports.addForm = (req, res) => {
  res.render('adicionar-contato', {
    errors: req.flash('errors'),
    csrfToken: req.csrfToken()
  });
};

// Cria novo contato
exports.create = async (req, res) => {
  try {
    const { nome, sobrenome, telefone, email } = req.body;

    // Verificar se pelo menos telefone ou email foi informado
    if (!telefone && !email) {
      req.flash('errors', 'Informe pelo menos telefone ou e-mail.');
      return res.redirect('/agenda/adicionar');
    }

    // Validação de telefone
    const telefoneRegex = /^(?!.*(\d)\1{7})\d{10,11}$/;
    if (telefone && !telefoneRegex.test(telefone)) {
      req.flash('errors', 'Número de telefone inválido. Deve ter 10 ou 11 dígitos e não conter muitos dígitos repetidos.');
      return res.redirect('/agenda/adicionar');
    }

    // Validação de e-mail
    const dominiosValidos = ['gmail.com', 'hotmail.com', 'outlook.com', 'uol.com.br', 'yahoo.com', 'icloud.com'];

    function dominioEhValido(email) {
      const dominio = email.split('@')[1];
      if (dominiosValidos.includes(dominio)) return true;
      const dominioCorporativoRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return dominioCorporativoRegex.test(dominio);
    }

    if (email && !dominioEhValido(email)) {
      req.flash('errors', 'Email inválido. Domínio não permitido.');
      return res.redirect('/agenda/adicionar');
    }

    const novoContato = new Agenda({
      nome,
      sobrenome,
      telefone,
      email,
      usuario: req.session.user ? req.session.user._id : null
    });

    await novoContato.save();

    req.flash('success', 'Contato criado com sucesso!');
    res.redirect('/agenda');
  } catch (error) {
    const erros = [];

    if (error.name === 'ValidationError') {
      for (let field in error.errors) {
        erros.push(error.errors[field].message);
      }
    } else {
      erros.push('Erro ao criar contato.');
    }

    req.flash('errors', erros);
    res.render('adicionar-contato', {
      errors: erros,
      csrfToken: req.csrfToken()
    });
  }
};

// Exibe formulário de edição
exports.editForm = async (req, res) => {
  try {
    const contato = await Agenda.findById(req.params.id);
    if (!contato) {
      req.flash('errors', 'Contato não encontrado.');
      return res.redirect('/agenda');
    }

    res.render('editarContato', {
      contato,
      csrfToken: req.csrfToken(),
      errors: req.flash('errors')
    });
  } catch (error) {
    console.log(error);
    req.flash('errors', 'Erro ao carregar o formulário de edição.');
    res.redirect('/agenda');
  }
};

// Atualiza contato
exports.update = async (req, res) => {
  try {
    const { nome, sobrenome, telefone, email } = req.body;

    if (!telefone && !email) {
      req.flash('errors', 'Informe pelo menos telefone ou e-mail.');
      return res.redirect(`/agenda/editar/${req.params.id}`);
    }

    const telefoneRegex = /^(?!.*(\d)\1{7})\d{10,11}$/;
    if (telefone && !telefoneRegex.test(telefone)) {
      req.flash('errors', 'Número de telefone inválido. Deve ter 10 ou 11 dígitos e não conter muitos dígitos repetidos.');
      return res.redirect(`/agenda/editar/${req.params.id}`);
    }

    const dominiosValidos = ['gmail.com', 'hotmail.com', 'outlook.com', 'uol.com.br', 'yahoo.com', 'icloud.com'];

    function dominioEhValido(email) {
      const dominio = email.split('@')[1];
      if (dominiosValidos.includes(dominio)) return true;
      const dominioCorporativoRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return dominioCorporativoRegex.test(dominio);
    }

    if (email && !dominioEhValido(email)) {
      req.flash('errors', 'Email inválido. Domínio não permitido.');
      return res.redirect(`/agenda/editar/${req.params.id}`);
    }

    await Agenda.findByIdAndUpdate(req.params.id, {
      nome,
      sobrenome,
      telefone,
      email
    });

    req.flash('success', 'Contato atualizado com sucesso!');
    res.redirect('/agenda');
  } catch (error) {
    console.log(error);
    req.flash('errors', 'Erro ao atualizar contato.');
    res.redirect(`/agenda/editar/${req.params.id}`);
  }
};

// Deleta contato
exports.delete = async (req, res) => {
  try {
    await Agenda.findByIdAndDelete(req.params.id);
    req.flash('success', 'Contato excluído com sucesso!');
    res.redirect('/agenda');
  } catch (error) {
    req.flash('errors', 'Erro ao excluir contato.');
    res.redirect('/agenda');
  }
};
