const express = require('express');
const router = express.Router();
const characterController = require('../controllers/character.controller');
const authenticateToken = require('../middleware/auth.middleware');

router.post('/', authenticateToken, characterController.createCharacter);
router.get('/me', authenticateToken, characterController.getCharacterForUser);
router.put('/me', authenticateToken, characterController.updateCharacter);

module.exports = router;