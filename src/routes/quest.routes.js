const express = require('express');
const router = express.Router();
const questController = require('../controllers/quest.controller');
const authenticateToken = require('../middleware/auth.middleware');

// --- ROTAS DE QUESTS (CRUD) ---

// CREATE: Criar uma nova quest
// Rota: POST /api/quests
router.post('/', authenticateToken, questController.createQuest);

// READ: Buscar todas as quests do usuário logado
// Rota: GET /api/quests
router.get('/', authenticateToken, questController.getQuestsForUser);

// UPDATE: Atualizar uma quest específica pelo seu ID
// Rota: PUT /api/quests/:id
router.put('/:id', authenticateToken, questController.updateQuest);

// DELETE: Deletar uma quest específica pelo seu ID
// Rota: DELETE /api/quests/:id
router.delete('/:id', authenticateToken, questController.deleteQuest);

module.exports = router;