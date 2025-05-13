const mongoose = require('mongoose');

const AgendaSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  sobrenome: { type: String, required: true },
  telefone: { type: String, required: true },
  email: { type: String, required: true },
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }  // opcional, se estiver usando login
}, { timestamps: true });

const Agenda = mongoose.model('Agenda', AgendaSchema);

module.exports = Agenda;
