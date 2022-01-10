const { Router } = require('express');
const { check } = require('express-validator');
const { categoriesCreate, obtenerCategorias, obtenerCategoria, categoriesUpdate, categoriesDelete } = require('../controllers/categories');
const { existCategoryById, existCategoryByName } = require('../helpers/db-validators');
const { validarJWT, isAdminRole } = require('../middlewares');
const validarCampos = require('../middlewares/validar-campos');

const router = Router();

// Obtener todas las categorias - publico
router.get('/', obtenerCategorias)

// obtener una categoria por id - publico
// crear middleware personalizado de si existe por el id  , crear funcion en helpers
router.get('/:id',[
  check('id', 'No es un ID Valido').isMongoId(),
  check('id').custom(existCategoryById),
  validarCampos
], obtenerCategoria)


// crear una nueva categoria - privado - debe tener token
router.post('/', [
  validarJWT,
  check('name', 'El nombre es requerido').not().isEmpty(),
  validarCampos
], categoriesCreate)

// actualizar - privado - cualquier token valido
router.put('/:id',[
  validarJWT,
  check('id', 'No es un ID Valido').isMongoId(),
  check('name', 'El nombre es requerido').not().isEmpty(),
  check('id').custom(existCategoryById),
  check('name').custom(existCategoryByName),
  validarCampos
], categoriesUpdate)

// borrar una categoria - admin
router.delete('/:id',[
  validarJWT,
  isAdminRole,
  check('id', 'No es un ID Valido').isMongoId(),
  check('id').custom(existCategoryById),
  validarCampos
], categoriesDelete)

module.exports = router;