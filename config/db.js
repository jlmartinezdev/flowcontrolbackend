const mysql = require('mysql');

// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
  host: 'localhost', // Cambiar por la dirección del host de tu base de datos
  user: 'root', // Cambiar por el usuario de tu base de datos
  password: '2792320', // Cambiar por la contraseña de tu base de datos
  database: 'nagua' // Cambiar por el nombre de tu base de datos
});

// Conexión a la base de datos
if(connection.state === 'disconnected'){
  connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conexión exitosa a la base de datos MySQL');
}); 
}
 










module.exports = connection;
