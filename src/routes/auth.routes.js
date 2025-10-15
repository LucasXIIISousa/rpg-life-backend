// backend/src/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const passport = require('passport'); // <-- Importar o Passport
const jwt = require('jsonwebtoken'); // <-- Importar o JWT para gerar o token no callback

const authController = require('../controllers/auth.controller');
const authenticateToken = require('../middleware/auth.middleware');

// --- ROTAS DE AUTENTICAÇÃO LOCAL ---
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', authenticateToken, authController.getProfile);


// --- ROTAS PARA O GOOGLE OAUTH ---

// Rota para iniciar o processo de autenticação com o Google
// Quando o usuário acessa essa rota, o Passport o redireciona para a tela de login do Google.
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Rota de callback que o Google irá chamar após o usuário autorizar.
router.get('/google/callback',
  passport.authenticate('google', { session: false }), // Usamos o Passport para verificar a resposta do Google
  (req, res) => {
    // Se a autenticação do Google foi bem-sucedida, o Passport nos dá o usuário em `req.user`.
    // Agora, nós criamos nosso próprio token JWT para ele.
    const user = req.user;
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    // Devolvemos o token para o usuário. Em um app real, poderíamos redirecionar para o frontend.
    res.json({ message: 'Login com Google bem-sucedido!', token });
  }
);


module.exports = router;