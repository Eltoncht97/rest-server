const { response } = require("express")
const { Product } = require('../models')

const getProducts = async ( req, res = response ) => {
  const { limit = 5, start = 0 } = req.query;

  const query = { state: true }

  const [ total, products ] = await Promise.all([
    Product.countDocuments(query),
    Product.find(query)
      .populate(['user', 'category'])
      .skip(Number(start))
      .limit(Number(limit))
  ])

  res.json({
    total,
    products
  });
}

const getProduct = async (req, res = response) => {
  const {id} = req.params

  const product = await Product.findById(id).populate('category')

  res.json(product)
}

const createProduct = async (req, res = response ) => {
  const name = req.body.name.toUpperCase()

  const productDB = await Product.findOne({ name })

  if( productDB ) {
    return res.status(400).json({
      msg: `El producto ${name} ya existe`
    })
  }

  // generar la data
  const data = {
    ...req.body,
    name,
    user: req.usuario._id
  }

  const product = await Product( data )

  await product.save()

  res.status(201).json(product)
}

const updateProduct = async ( req, res = response ) => {
  const id = req.params.id;
  let name;
  let data;
  
  if(req.body.name) {
    name = req.body.name.toUpperCase();
    data = {
      ...req.body,
      name
    }
  }else {
    data = {
      ...req.body
    }
  }


  const product = await Product.findByIdAndUpdate( id, data , { new: true } );

  res.status(200).json(product);
}

const deleteProduct = async ( req, res = response ) => {
  const id = req.params.id;

  const product = await Product.findByIdAndUpdate(id, {state: false}, { new: true });

  res.status(200).json({product});
} 

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
}