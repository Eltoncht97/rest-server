const { response } = require("express");

const isAdminRole = (req, res = response, next) => {

  if( !req.usuario ) {
    return res.status(500).json({
      msg: 'Se quiere verificar el role sin verificar el token primero'
    })
  }

  const { role, nombre } = req.usuario;
  if( role !== 'ADMIN_ROLE' ) {
    return res.status(401).json({
      msg: `${nombre} no es administrador - no puede hacer esto`
    })
  }

  next();
}

const hasRole = ( ...roles ) => {
  return (req, res = response, next) => {
    if( !req.usuario ) {
      return res.status(500).json({
        msg: 'Se quiere verificar el role sin verificar el token primero'
      })
    }

    if( !roles.includes( req.usuario.role )) {
      return res.status(401).json({
        msg: `El servicio require uno de estos roles ${roles}`
      })
    }

    next()
  }
}

module.exports = {
  isAdminRole,
  hasRole
}