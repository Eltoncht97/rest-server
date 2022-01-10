const bcryptjs = require("bcryptjs");
const { response } = require("express");
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");
const Usuario = require('../models/user')

const login = async (req, res = response) => {
  const { email, password } = req.body;
  try {
    // verificar si el mail existe
    const usuario = await Usuario.findOne({email}) 
    if(!usuario){
      return res.status(400).json({
        msg: 'Usuario / password no son correctos - correo'
      })
    }
    
    // si el usuario esta activo
    if(!usuario.estado){
      return res.status(400).json({
        msg: 'Usuario / password no son correctos - estado'
      })
    }
    
    // verificar contra
    const validPassword = bcryptjs.compareSync(password, usuario.password)
    if(!validPassword) {
      return res.status(400).json({
        msg: 'Usuario / password no son correctos - passsword'
      })
    }

    // generar jwt
    const token = await generarJWT( usuario.id)

    res.json({
      msg: "Login",
      usuario,
      token
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      msg: 'Hable con el administrador'
    })
  }
}

const googleSignIn = async ( req, res = response ) => {
  const { id_token } = req.body;

  try {

    const { nombre, imagen, email } = await googleVerify( id_token );

    let usuario = await Usuario.findOne({ email });

    if( !usuario ) {
      // Hay que crearlo
      const data = {
        nombre,
        email,
        password: ':p',
        imagen,
        google: true,
        role: 'USER_ROLE'
      }

      usuario = new Usuario( data )
      await usuario.save()
    }

    // Si el usuario en db tiene estado false
    if( !usuario.estado ) {
      return res.status(401).json({
        msg: 'Hable con el administrador, usuario bloqueado'
      })
    }

    // generar jwt
    const token = await generarJWT( usuario.id );

    res.json({
      usuario,
      token
    })

  } catch (error) {
    console.log(error)
    res.status(400).json({
      ok: false,
      msg: 'El Token no se pudo verificar'
    })
  }
}

module.exports = {
  login,
  googleSignIn
}