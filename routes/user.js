const { Router } = require('express');
const { check } = require('express-validator');
const { usuariosGet, usuariosPost, usuariosPut, usuariosPatch, usuariosDelete } = require('../controllers/user');
const { isRoleValid, existEmail, existUserById } = require('../helpers/db-validators');
const { validarCampos, validarJWT, isAdminRole, hasRole } = require('../middlewares');

const router = Router();

router.get('/', usuariosGet);
router.post('/', [
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  check('password', 'El password debe ser de mas de 6 letras').isLength({min: 6}),
  check('email', 'Email no valido').isEmail(),
  // check('role', 'No es un role valido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
  check('email').custom( existEmail ),
  check('role').custom( isRoleValid ),
  validarCampos
], usuariosPost);
router.put('/:id', [
  check('id', 'No es un ID valido').isMongoId(),
  check('id').custom( existUserById ),
  check('role').custom( isRoleValid ),
  validarCampos
], usuariosPut);
router.patch('/:id', usuariosPatch);
router.delete('/:id', [
  validarJWT,
  // isAdminRole,
  hasRole('ADMIN_ROLE', 'VENTAS_ROLE'),
  check('id', 'No es un ID valido').isMongoId(),
  check('id').custom( existUserById ),
  validarCampos
], usuariosDelete);

module.exports = router;