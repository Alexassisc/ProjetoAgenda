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
  console.log('Sessão do usuário:', req.session.user);  // Adicione este log // Adicione este log
  try {
    const { nome, sobrenome, telefone, email } = req.body;
    const novoContato = new Agenda({
      nome,
      sobrenome,
      telefone,
      email,
      usuario: req.session.user ? req.session.user._id : null // se usar autenticação
    });
    await novoContato.save();
    req.flash('success', 'Contato criado com sucesso!');
    res.redirect('/agenda');
  } catch (error) {
    req.flash('errors', 'Erro ao criar contato.');
    res.redirect('/agenda');
  }
};


// Exibe formulário de edição
exports.editForm = async (req, res) => {
  try {
    const contato = await Agenda.findById(req.params.id).lean();
    if (!contato) {
      req.flash('errors', 'Contato não encontrado.');
      return res.redirect('/agenda');
    }
    res.render('editarContato', { contato, csrfToken: req.csrfToken() });
  } catch (error) {
    req.flash('errors', 'Erro ao carregar contato.');
    res.redirect('/agenda');
  }
};

// Atualiza contato
exports.update = async (req, res) => {
  try {
    const { nome, sobrenome, telefone, email } = req.body;
    await Agenda.findByIdAndUpdate(req.params.id, {
      nome,
      sobrenome,
      telefone,
      email
    });
    req.flash('success', 'Contato atualizado com sucesso!');
    res.redirect('/agenda');
  } catch (error) {
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
