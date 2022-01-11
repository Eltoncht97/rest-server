const { response } = require("express");
const { Category } = require("../models");

const obtenerCategorias = async (req, res = response) => {
  const { limit = 5, start = 0 } = req.query

  const query = {state: true}

  const [total, categories] = await Promise.all([
    Category.countDocuments(query),
    Category.find(query)
      .populate('user', 'nombre')
      .skip(Number(start))
      .limit(Number(limit))
  ])

  res.json({
    total,
    categories
  })
}

const obtenerCategoria = async (req, res = response) => {
  const { id } = req.params

  const category = await Category.findById(id).populate('user', 'nombre')

  res.json(category)
}

const categoriesCreate = async ( req, res = response ) => {
  const name = req.body.name.toUpperCase();

  const categoryDB = await Category.findOne({ name })

  if( categoryDB ) {
    return res.status(400).json({
      msg: `La categoria ${ categoryDB.name } ya existe.`
    })
  }

  // Generar la data
  const data = {
    name, 
    user: req.usuario._id
  }

  const category = await Category( data );

  // Guardar en DB
  await category.save();

  res.status(201).json(category);
}

const categoriesUpdate = async ( req, res = response ) => {
  const id = req.params.id;
  const name = req.body.name.toUpperCase();

  const category = await Category.findByIdAndUpdate( id, {name}, { new: true } );

  res.status(200).json(category);
}

const categoriesDelete = async ( req, res = response ) => {
  const id = req.params.id;

  const category = await Category.findByIdAndUpdate(id, {state: false}, { new: true });

  res.status(200).json({category});
} 

module.exports = {
  obtenerCategorias,
  obtenerCategoria,
  categoriesCreate,
  categoriesUpdate,
  categoriesDelete
}