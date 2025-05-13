const mongoose = require('mongoose');

const HomeSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descricao: String
});

const HomeModel = mongoose.model('Home', HomeSchema);

module.exports = HomeModel;  // Verifique se está exportando o modelo corretamente
