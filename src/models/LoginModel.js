const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const LoginSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.user = null;
  }

  async login() {
    this.user = await LoginModel.findOne({ email: this.body.email });
    if (!this.user) {
      this.errors.push('Usuário não encontrado');
      return;
    }

    const validPassword = await bcrypt.compare(this.body.password, this.user.password);
    if (!validPassword) {
      this.errors.push('Senha inválida');
      this.user = null;
    }
  }

  async register() {
    this.user = await LoginModel.findOne({ email: this.body.email });
    if (this.user) {
      this.errors.push('Usuário já existe');
      return;
    }

    const salt = bcrypt.genSaltSync();
    this.body.password = bcrypt.hashSync(this.body.password, salt);

    this.user = await LoginModel.create(this.body);
  }
}

module.exports = Login;
