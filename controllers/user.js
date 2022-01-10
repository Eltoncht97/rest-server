const bcryptjs = require('bcryptjs');
const { response } = require('express');
const Usuario = require('../models/user');

const usuariosGet = async (req, res = response) => {
  const { limit = 5, start = 0 } = req.query
  
  const query = {estado: true}

  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments(query),
    Usuario.find(query)
      .skip(Number(start))
      .limit(Number(limit))
  ])

  res.status(200).json({
    total,
    usuarios
  })
}

const usuariosPost = async (req, res) => {
  const {nombre, email, password, role} = req.body;
  const usuario = new Usuario({nombre, email, password, role});

  // Encriptar contraseña
  const salt = bcryptjs.genSaltSync();
  usuario.password = bcryptjs.hashSync( password, salt );
  // Guardar en base de datos
  await usuario.save()
  res.status(201).json({
    usuario
  })
}

const usuariosPut = async (req, res) => {
  const id = req.params.id
  const { password, google, email, ...resto } = req.body

  // TODO validar con base de datos
  if ( password ) {
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync( password, salt );
  }

  const usuario = await Usuario.findByIdAndUpdate(id, resto, { new: true })

  res.status(200).json({
    msg: "put API - controller",
    usuario
  })
}

const usuariosPatch = (req, res) => {
  res.status(200).json({
    msg: "patch API - controller"
  })
}

const usuariosDelete = async (req, res) => {

  const {id} = req.params
  
  // Borrar fisicamente
  // const usuario = await Usuario.findByIdAndDelete(id)
  
  const usuario = await Usuario.findByIdAndUpdate(id, {estado: false}, { new: true })

  res.status(200).json({usuario})
}

module.exports = {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosPatch,
  usuariosDelete
}