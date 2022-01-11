const { response } = require("express");
const { ObjectId } = require("mongoose").Types;
const { Usuario, Category, Product } = require('../models');

const coleccionesPermitidas = [
  'usuarios',
  'categories',
  'products',
  'roles'
]

const searchUsers = async( term = '', res = response ) => {

  const isMongoId = ObjectId.isValid( term )

  if( isMongoId ) {
    const user = await Usuario.findById(term)
    return res.json({
      results: user ? [ user ] : []
    })
  }

  const regex = new RegExp( term, 'i' );

  const users = await Usuario.find({
    $or: [{ nombre: regex }, { email: regex }],
    $and: [{ estado: true }]
  })

  res.json({
    results: users
  })
}

const searchCategories = async( term = '', res = response ) => {

  const isMongoId = ObjectId.isValid( term )

  if( isMongoId ) {
    const category = await Category.findById(term)
    return res.json({
      results: category ? [ category ] : []
    })
  }

  const regex = new RegExp( term, 'i' );

  const categories = await Category.find({ name: regex, state: true })

  res.json({
    results: categories
  })
}

const searchProducts = async( term = '', res = response ) => {

  const isMongoId = ObjectId.isValid( term )

  if( isMongoId ) {
    const product = await Product.findById(term).populate('category', 'name')
    return res.json({
      results: product ? [ product ] : []
    })
  }

  const regex = new RegExp( term, 'i' );

  const products = await Product.find({ name: regex, state: true }).populate('category', 'name')

  res.json({
    results: products
  })
}

const search = ( req, res = response ) => {

  const { collection, term } = req.params

  if( !coleccionesPermitidas.includes(collection) ){
    return res.status(400).json({
      msg: `Las colecciones permitidas son : ${coleccionesPermitidas}`
    })
  }

  switch (collection) {
    case 'usuarios':
      searchUsers(term, res) 
      break;

    case 'categories':
      searchCategories(term, res)
      break;

    case 'products':
      searchProducts(term, res)
      break;
  
    default:
      res.status(500).json({
        msg: 'Se me olvido hacer esta busqueda'
      })
  }
}

const searchProductsByCategory = async ( req, res = response ) => {
  const { category } = req.params

  const products = await Product.find({ category: ObjectId(category), state: true }).populate('category', 'name')

  res.json({
    results: products
  })
}

module.exports = {
  search,
  searchProductsByCategory
}