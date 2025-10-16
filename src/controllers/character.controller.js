const { pool } = require('../config/database');

exports.createCharacter = async (req, res) => {
  const userId = req.user.userId;
  const { name, appearance } = req.body;

  if (!name || !appearance || !appearance.hair || !appearance.eyes) {
    return res.status(400).json({ error: 'Dados de nome e aparência (incluindo cabelo e olhos) são obrigatórios.' });
  }

  try {
    const existingCharacter = await pool.query('SELECT id FROM characters WHERE user_id = $1', [userId]);
    if (existingCharacter.rows.length > 0) {
      return res.status(409).json({ error: 'Você já possui um personagem.' });
    }

    const defaultAttributes = { strength: 5, dexterity: 5, intelligence: 5, vitality: 5 };

    const newCharacter = await pool.query(
      `INSERT INTO characters (user_id, name, attributes, appearance)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [userId, name, defaultAttributes, appearance]
    );

    res.status(201).json(newCharacter.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor ao criar o personagem.' });
  }
};

exports.getCharacterForUser = async (req, res) => {
  const userId = req.user.userId;
  try {
    const result = await pool.query('SELECT * FROM characters WHERE user_id = $1', [userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Nenhum personagem encontrado para este usuário.' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err)
 {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor ao buscar o personagem.' });
  }
};

exports.updateCharacter = async (req, res) => {
  const userId = req.user.userId;
  const { name, appearance } = req.body;

  if (!name && !appearance) {
    return res.status(400).json({ error: 'Nenhum dado para atualizar foi fornecido (nome ou aparência).' });
  }

  try {
    const currentCharacterResult = await pool.query('SELECT * FROM characters WHERE user_id = $1', [userId]);
    if (currentCharacterResult.rows.length === 0) {
      return res.status(404).json({ error: 'Personagem não encontrado para atualizar.' });
    }
    const currentCharacter = currentCharacterResult.rows[0];

    const newName = name || currentCharacter.name;
    const newAppearance = { ...currentCharacter.appearance, ...appearance };

    const updatedCharacter = await pool.query(
      `UPDATE characters SET name = $1, appearance = $2, updated_at = NOW()
       WHERE user_id = $3
       RETURNING *`,
      [newName, newAppearance, userId]
    );

    res.status(200).json(updatedCharacter.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor ao atualizar o personagem.' });
  }
};