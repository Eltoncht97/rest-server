const { Category, Product } = require('../models')
const Role = require('../models/role')
const Usuario = require('../models/user')

const isRoleValid = async (rol='') => {
  const existRol = await Role.findOne({rol})
  if(!existRol){
    throw new Error(`El rol ${rol} no esta registrado en la base de datos`)
  }
}

// Verificar si el correo existe
const existEmail = async (email='') => {

  const existeEmail = await Usuario.findOne({email})
  if(existeEmail){
    throw new Error(`Ya existe un usuario con el email ${email}`)
  }
}

const existUserById = async (id='') => {
  const existeUsuario = await Usuario.findById(id)
  if(!existeUsuario){
    throw new Error(`No existe un usuario con el id ${id}`)
  }
}

const existCategoryById = async (id='') => {
  const existeCategoria = await Category.findById(id)
  if(!existeCategoria) {
    throw new Error(`No existe una categoria con el id ${id}`)
  }
}

const existCategoryByName = async (name='') => {
  const existeCategoria = await Category.findOne({name: name.toUpperCase()})
  if(existeCategoria) {
    throw new Error(`Ya existe una categoria con el nombre ${name}`)
  }
}

const existProductById = async (id='') => {
  const existeProducto = await Product.findById(id)
  if(!existeProducto) {
    throw new Error(`No existe un producto con el id ${id}`)
  }
}

const existProductByName = async (name='') => {
  const existeProducto = await Product.findOne({name: name.toUpperCase()})
  if(existeProducto) {
    throw new Error(`Ya existe un producto con el nombre ${name}`)
  }
}

module.exports = {
  isRoleValid,
  existEmail,
  existUserById,
  existCategoryById,
  existCategoryByName,
  existProductById,
  existProductByName
}