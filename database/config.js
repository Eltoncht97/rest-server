const mongoose = require('mongoose')

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    console.log('Base de datos conectada');
    
  } catch (error) {
    console.log(error);
    throw new Error('Error a la hora de inicializar la base de datos');
  }
}

module.exports = dbConnection;