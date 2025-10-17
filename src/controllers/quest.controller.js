// backend/src/controllers/quest.controller.js
const { pool } = require('../config/database');

exports.createQuest = async (req, res) => {
  const userId = req.user.userId;
  const { title, description, difficulty, tags, rewards, recurrence_type } = req.body;

  if (!title || !difficulty || !tags || !rewards || !rewards.attributes) {
    return res.status(400).json({ error: 'Título, dificuldade, tags e recompensas de atributos são obrigatórios.' });
  }

  let xp_base = 0;
  switch (difficulty.toLowerCase()) {
    case 'fácil': xp_base = 100; break;
    case 'médio': xp_base = 250; break;
    case 'difícil': xp_base = 500; break;
    default: xp_base = 50;
  }

  try {
    const newQuest = await pool.query(
      `INSERT INTO quests (user_id, title, description, difficulty, tags, rewards, xp_base, multiplier, recurrence_type)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        userId, title, description, difficulty,
        JSON.stringify(tags), JSON.stringify(rewards),
        xp_base, 1.0, recurrence_type || 'única'
      ]
    );
    res.status(201).json(newQuest.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor ao criar a quest.' });
  }
};

exports.getQuestsForUser = async (req, res) => {
  const userId = req.user.userId;
  try {
    const result = await pool.query('SELECT * FROM quests WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    const quests = result.rows;

    const updatedQuests = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const quest of quests) {
      let needsUpdate = false;
      let resetStreak = false;

      const lastCompleted = quest.last_completed_at ? new Date(quest.last_completed_at) : null;
      if (lastCompleted) {
        lastCompleted.setHours(0, 0, 0, 0);
      }

      if (quest.recurrence_type === 'diária' && quest.is_completed && lastCompleted < today) {
        quest.is_completed = false;
        quest.progress = 0;
        quest.completed_at = null;
        needsUpdate = true;

        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        if (lastCompleted < yesterday) {
          quest.consistency_streak = 0;
          resetStreak = true;
        }
      }

      if (needsUpdate) {
        let updateQuery = 'UPDATE quests SET is_completed = false, progress = 0, completed_at = null';
        if (resetStreak) {
          updateQuery += ', consistency_streak = 0';
        }
        updateQuery += ' WHERE id = $1';
        await pool.query(updateQuery, [quest.id]);
      }
      updatedQuests.push(quest);
    }
    res.status(200).json(updatedQuests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor ao buscar as quests.' });
  }
};

exports.updateQuest = async (req, res) => {
  res.status(200).json({ message: 'Funcionalidade de atualizar quests ainda não implementada.' });
};

exports.deleteQuest = async (req, res) => {
  res.status(200).json({ message: 'Funcionalidade de deletar quests ainda não implementada.' });
};