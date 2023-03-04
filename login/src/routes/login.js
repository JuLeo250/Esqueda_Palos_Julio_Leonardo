//aqui nos redirecciona a las funciones que estan en LoginControllers

//importamos el modulo express
const express = require('express');
//ponemos la ruta del archivo de LoginController
const LoginController = require('../controllers/LoginController');

//se crea un router en node.js.
const router = express.Router();

//las rutas 
router.get('/login', LoginController.index);
router.get('/register', LoginController.register);
router.post('/register', LoginController.storeUser);
router.post('/login', LoginController.auth);
router.get('/logout', LoginController.logout);

//nos va a exportar el router con todas sus rutas en el app.js
module.exports = router;
