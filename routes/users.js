
// Path: routes\users.js
const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users'); // Importa el controlador de usuarios

// Rutas para el registro y el inicio de sesión de usuarios
router.post('/register', usersController.register);
router.post('/login', usersController.login);

// Ruta para el cierre de sesión de usuarios
router.get('/logout', usersController.logout);

// Rutas para la verificación del token, la obtención, actualización y eliminación de usuarios
router.get('/user', usersController.verifyToken, usersController.getUser);
router.put('/user', usersController.verifyToken, usersController.updateUser);
router.delete('/user', usersController.verifyToken, usersController.deleteUser);

module.exports = router;