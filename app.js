const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./config/db'); // Importa la configuración de la base de datos MySQL
const usersRoutes = require('./routes/users'); // Importa las rutas de usuarios
const sensoresRoutes= require('./routes/sensores');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use('/api/users', usersRoutes); // Define el prefijo /api/users para las rutas de usuarios
app.use('/api/sensor', sensoresRoutes);
console.log(db.state)


app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

