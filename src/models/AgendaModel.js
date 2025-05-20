const mongoose = require('mongoose');

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|br|net|org|edu|gov)(\.[a-z]{2})?$/i;
const telefoneRegex = /^(?!.*(\d)\1{7})\d{10,11}$/;

const AgendaSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  sobrenome: { type: String, required: true },
  telefone: { 
    type: String, 
    required: false,
    default: '',
    match: [telefoneRegex, 'Número de telefone inválido']
  },
  email: { 
    type: String, 
    required: false, 
    default: '',
    match: [emailRegex, 'Email inválido']
  },
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Login', required: true }  // referenciando o modelo Login
}, { timestamps: true });

AgendaSchema.path('telefone').validate(function (value) {
  return this.telefone || this.email;
}, 'Pelo menos telefone ou email deve ser fornecido.');

AgendaSchema.path('email').validate(function (value) {
  return this.telefone || this.email;
}, 'Pelo menos telefone ou email deve ser fornecido.');

module.exports = mongoose.model('Agenda', AgendaSchema);
