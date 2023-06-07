
// Path: routes\users.js
const express = require('express');
const router = express.Router();
const sensoresController = require('../controllers/sensores.js');
const usersController = require('../controllers/users.js');

// Rutas para el registro y el inicio de sesión de usuarios
router.post('/register', sensoresController.register);


// Ruta para el cierre de sesión de usuarios
router.get('/sensores',usersController.verifyToken, sensoresController.getAll);

// Rutas para la verificación del token, la obtención, actualización y eliminación de usuarios
router.get('/sensor', usersController.verifyToken, sensoresController.getSensor);
router.put('/sensor', usersController.verifyToken, sensoresController.updateSensor);
router.delete('/sensor', usersController.verifyToken, sensoresController.deleteSensor);

module.exports = router;