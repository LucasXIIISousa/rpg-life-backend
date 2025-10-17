const { pool } = require('../config/database');

exports.createQuest = async (req, res) => {
  const userId = req.user.userId;
  const { title, description, difficulty, tags, rewards, recurrence_type } = req.body;

  if (!title || !difficulty || !tags || !rewards || !rewards.attributes) {
    return res.status(400).json({ error: 'Título, dificuldade, tags e recompensas de atributos são obrigatórios.' });
  }

  let xp_base = 0;
  switch (difficulty.toLowerCase()) {
    case 'fácil':
      xp_base = 100;
      break;
    case 'médio':
      xp_base = 250;
      break;
    case 'difícil':
      xp_base = 500;
      break;
    default:
      xp_base = 50;
  }

  try {
    const newQuest = await pool.query(
      `INSERT INTO quests (user_id, title, description, difficulty, tags, rewards, xp_base, multiplier, recurrence_type)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [userId, title, description, difficulty, tags, rewards, xp_base, 1.0, recurrence_type || 'única']
    );

    res.status(201).json(newQuest.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor ao criar a quest.' });
  }
};

// Funções que implementaremos a seguir
exports.getQuestsForUser = async (req, res) => {
  res.status(200).json({ message: 'Funcionalidade de listar quests ainda não implementada.' });
};

exports.updateQuest = async (req, res) => {
  res.status(200).json({ message: 'Funcionalidade de atualizar quests ainda não implementada.' });
};

exports.deleteQuest = async (req, res) => {
  res.status(200).json({ message: 'Funcionalidade de deletar quests ainda não implementada.' });
};