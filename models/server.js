const express = require("express");
const cors = require("cors");
const userRouter = require("../routes/user");
const authRouter = require("../routes/auth");
const productsRouter = require("../routes/products");
const categoriesRouter = require("../routes/categories");
const dbConnection = require("../database/config");

class Server{
  constructor(){
    this.app = express();
    this.port = process.env.PORT;
    this.paths = {
      usuarios: '/api/usuarios',
      auth: '/api/auth',
      categories: '/api/categories',
      products: '/api/products',
    }

    // Conectar a base de datos
    this.conectDb();

    // Middlewares
    this.middlewares();

    // Rutas de la app
    this.routes();
  }

  async conectDb(){
    await dbConnection();
  }

  middlewares(){
    // CORS
    this.app.use(cors());

    // Lectura y parseo del body
    this.app.use(express.json());

    // Directorio publico
    this.app.use(express.static('public'))
  }

  routes(){
    this.app.use(this.paths.usuarios, userRouter);
    this.app.use(this.paths.auth, authRouter);
    this.app.use(this.paths.categories, categoriesRouter);
    this.app.use(this.paths.products, productsRouter);
  }

  listen(){
    this.app.listen(this.port, () => {
      console.log(`Servidor corriendo en puerto ${this.port}`)
    })
  }
}

module.exports = Server;