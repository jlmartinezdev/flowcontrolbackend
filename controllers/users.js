const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db'); // Importa la configuración de la base de datos MySQL
const SECRET_KEY = 'clave_secreta'; // Clave secreta para la generación de JWT

// Función para el registro de usuarios
exports.register = (req, res) => {
  const { nombre, email, password } = req.body;
  
  // Verifica si el usuario ya existe en la base de datos

  db.query('SELECT * FROM users WHERE users_email = ?', [email], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }

    if (results.length > 0) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Encripta la contraseña con bcrypt
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        return res.status(500).json({ error: err });
      }

      // Inserta el nuevo usuario en la base de datos
      db.query('INSERT INTO users (users_name, users_email, users_password) VALUES (?, ?, ?)', [nombre, email, hash], (err, results) => {
        if (err) {
          return res.status(500).json({ error: 'Error en el servidor'+err });
        }

        // Genera y retorna un JWT al usuario
        const token = jwt.sign({ id: results.insertId }, SECRET_KEY, { expiresIn: '1h' });
        res.status(201).json({ mensaje: 'Usuario registrado exitosamente', token });
      });
    });
  });
};

// Función para el inicio de sesión de usuarios
exports.login = (req, res) => {
  const { email, password } = req.body;
  console.log(req);
  
  // Verifica si el usuario existe en la base de datos
  db.query('SELECT * FROM users WHERE users_email = ?', [email], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error get user, '+ err });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'El usuario no está registrado' });
    }

    // Compara la contraseña ingresada con la contraseña almacenada en la base de datos

    bcrypt.compare(password, results[0].users_password, (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Error compare, ' + err });
      }

      if (!result) {
        return res.status(401).json({ error: 'Contraseña incorrecta' });
      }

      // Genera y retorna un JWT al usuario
      const token = jwt.sign({ id: results[0].id }, SECRET_KEY, { expiresIn: '1h' });
      res.status(200).json({ mensaje: 'Inicio de sesión exitoso', token });
    });
  });
};


exports.logout = (req, res) => {
  res.status(200).json({ mensaje: 'Cierre de sesión exitoso' });
};

// Función para verificar el token de un usuario
exports.verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'];

  if (!token) {
    return res.status(401).json({ error: 'No se ha enviado un token' });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token inválido' });
    }

    req.userId = decoded.id;
    next();
  });
};

// Función para obtener los datos de un usuario
exports.getUser = (req, res) => { 
  db.query('SELECT * FROM users WHERE users_id = ?', [req.userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error en el servidor' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'El usuario no está registrado' });
    }

    res.status(200).json({ mensaje: 'Datos del usuario', data: results[0] });
  });
};

// Función para actualizar los datos de un usuario
exports.updateUser = (req, res) => {
  const { nombre, email, password } = req.body;
  
  // Encripta la contraseña con bcrypt
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({ error: 'Error en el servidor' });
    }

    // Actualiza los datos del usuario en la base de datos
    db.query('UPDATE users SET users_name = ?, users_email = ?, users_password = ? WHERE users_id = ?', [nombre, email, hash, req.userId], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error en el servidor' });
      }

      res.status(200).json({ mensaje: 'Datos del usuario actualizados' });
    });
  });
};

// Función para eliminar un usuario
exports.deleteUser = (req, res) => {
  db.query('DELETE FROM users WHERE users_id = ?', [req.userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error en el servidor' });
    }

    res.status(200).json({ mensaje: 'Usuario eliminado exitosamente' });
  });
};
