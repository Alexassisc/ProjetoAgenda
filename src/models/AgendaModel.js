const mongoose = require('mongoose');

// Validação de e-mail com expressão regular
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|br|net|org|edu|gov)(\.[a-z]{2})?$/i;

// Validação de telefone (exemplo para o Brasil com DDD e 9 dígitos)
const telefoneRegex = /^(?!.*(\d)\1{7})\d{10,11}$/;

const AgendaSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  sobrenome: { type: String, required: true },
  
  // Validação do telefone
  telefone: { 
    type: String, 
    required: false,
    default: '',
    match: [telefoneRegex, 'Número de telefone inválido'] // Validação usando regex
  },
  
  // Validação do e-mail
  email: { 
    type: String, 
    required: false, 
    default: '',
    match: [emailRegex, 'Email inválido'] // Validação usando regex
  },
  
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // opcional, se estiver usando login
}, { timestamps: true });

AgendaSchema.path('telefone').validate(function (value) {
  return this.telefone || this.email;
}, 'Pelo menos telefone ou email deve ser fornecido.');

AgendaSchema.path('email').validate(function (value) {
  return this.telefone || this.email;
}, 'Pelo menos telefone ou email deve ser fornecido.');

const Agenda = mongoose.model('Agenda', AgendaSchema);

module.exports = Agenda;
