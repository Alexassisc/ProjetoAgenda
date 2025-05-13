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
  res.render('adicionar-contato');
};

// Cria novo contato
exports.create = async (req, res) => {
  try {
    const { nome, sobrenome, telefone, email } = req.body;

    // Função de validação para o telefone
    const telefoneRegex = /^[0-9]{10,11}$/;
    if (!telefoneRegex.test(telefone)) {
      req.flash('errors', 'Número de telefone inválido. Deve ter 10 ou 11 dígitos.');
      return res.redirect('/agenda/adicionar');
    }

    // Função de validação para o e-mail
    const dominiosValidos = ['gmail.com', 'hotmail.com', 'outlook.com', 'uol.com.br', 'yahoo.com', 'icloud.com'];

    function dominioEhValido(email) {
      const dominio = email.split('@')[1];
      
      // Permitir se for um dos domínios da lista
      if (dominiosValidos.includes(dominio)) return true;

      // Permitir domínios corporativos: pelo menos uma `.`, e termina com letras
      const dominioCorporativoRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return dominioCorporativoRegex.test(dominio);
    }

    if (!dominioEhValido(email)) {
      req.flash('errors', 'Email inválido. Domínio não permitido.');
      return res.redirect('/agenda/adicionar');
    }

    // Cria um novo contato
    const novoContato = new Agenda({
      nome,
      sobrenome,
      telefone,
      email,
      usuario: req.session.user ? req.session.user._id : null
    });

    // Salva o novo contato
    await novoContato.save();

    req.flash('success', 'Contato criado com sucesso!');
    res.redirect('/agenda');
  } catch (error) {
    const erros = [];

    // Se for um erro de validação
    if (error.name === 'ValidationError') {
      // Verifica se o erro foi relacionado ao telefone ou ao e-mail
      for (let field in error.errors) {
        erros.push(error.errors[field].message);
      }
    } else {
      erros.push('Erro ao criar contato.');
    }

    // Passa os erros para o EJS (na página de criação de contato)
    req.flash('errors', erros);
    res.render('adicionar-contato', { errors: erros });
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
      errors: req.flash('errors') // ← Isso está correto
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

    // Validar telefone (10 ou 11 dígitos)
    const telefoneRegex = /^[0-9]{10,11}$/;
    if (!telefoneRegex.test(telefone)) {
      req.flash('errors', 'Número de telefone inválido. Deve ter 10 ou 11 dígitos.');
      return res.redirect(`/agenda/editar/${req.params.id}`);
    }

    // Função de validação para o e-mail
    const dominiosValidos = ['gmail.com', 'hotmail.com', 'outlook.com', 'uol.com.br', 'yahoo.com', 'icloud.com'];

    function dominioEhValido(email) {
      const dominio = email.split('@')[1];
      
      // Permitir se for um dos domínios da lista
      if (dominiosValidos.includes(dominio)) return true;

      // Permitir domínios corporativos: pelo menos uma `.`, e termina com letras
      const dominioCorporativoRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return dominioCorporativoRegex.test(dominio);
    }

    if (!dominioEhValido(email)) {
      req.flash('errors', 'Email inválido. Domínio não permitido.');
      return res.redirect(`/agenda/editar/${req.params.id}`);
    }

    // Atualizar o contato
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
