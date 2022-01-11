const { Router } = require('express');
const { check } = require('express-validator');
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('../controllers/products');
const { existProductById, existProductByName, existCategoryById } = require('../helpers/db-validators');
const { validarJWT, isAdminRole } = require('../middlewares');
const validarCampos = require('../middlewares/validar-campos');

const router = Router();

router.get('/', getProducts)
router.get('/:id',[
  check('id', 'No es un ID Valido').isMongoId(),
  check('id').custom(existProductById),
  validarCampos
], getProduct)
router.post('/',[
  validarJWT,
  check('name', 'El nombre es requerido').not().isEmpty(),
  check('category', 'No es un ID de Mongo').isMongoId(),
  check('category', 'La categoria es requerida').not().isEmpty(),
  check('category').custom(existCategoryById),
  validarCampos
], createProduct)
router.put('/:id',[
  validarJWT,
  check('id', 'No es un ID Valido').isMongoId(),
  check('id').custom(existProductById),
  validarCampos
], updateProduct)
router.delete('/:id',[
  validarJWT,
  isAdminRole,
  check('id', 'No es un ID Valido').isMongoId(),
  check('id').custom(existProductById),
  validarCampos
], deleteProduct)

module.exports = router;