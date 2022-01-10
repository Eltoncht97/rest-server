const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es requerido']
  },
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'La contraseña es requerido'],
  },
  imagen: {
    type: String,
  },
  role: {
    type: String,
    required: true
  },
  estado: {
    type: Boolean,
    default: true
  },
  google: {
    type: Boolean,
    default: false
  }
})

UsuarioSchema.methods.toJSON = function () {
  const { __v, password, _id, ...user } = this.toObject()
  user.uid = _id;
  return user
}

module.exports = model( 'Usuario', UsuarioSchema )