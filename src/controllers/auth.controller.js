// backend/src/controllers/auth.controller.js
const { pool } = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// IMPORTANTE: Em um projeto real, esta chave deve vir de variáveis de ambiente!
const SECRET_KEY = 'minha_chave_super_secreta_para_o_jwt';

// Função para registrar um usuário
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  // Validação simples
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
  }

  try {
    // Criptografa a senha antes de salvar no banco
    const hashedPassword = await bcrypt.hash(password, 10); // 10 é o "custo" do hash

    // Insere o novo usuário no banco de dados
    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, email',
      [name, email, hashedPassword]
    );

    const user = result.rows[0];

    // Gera um token JWT para o novo usuário
    const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });

    // Retorna uma resposta de sucesso com o token
    res.status(201).json({ message: 'Usuário registrado com sucesso!', token });

  } catch (err) {
    // Trata o erro caso o e-mail já exista no banco
    if (err.code === '23505') { // Código de erro do PostgreSQL para violação de UNIQUE
      return res.status(409).json({ error: 'Este e-mail já está em uso.' });
    }
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor ao tentar registrar.' });
  }
};

// Função para fazer login de um usuário
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Procura o usuário pelo e-mail
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    // Se o usuário não for encontrado, retorna erro
    if (!user) {
      return res.status(401).json({ error: 'Email ou senha inválidos.' });
    }

    // Compara a senha enviada com a senha criptografada no banco
    const isMatch = await bcrypt.compare(password, user.password_hash);

    // Se as senhas não baterem, retorna erro
    if (!isMatch) {
      return res.status(401).json({ error: 'Email ou senha inválidos.' });
    }

    // Se tudo estiver correto, gera um novo token JWT
    const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login bem-sucedido!', token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor ao tentar fazer login.' });
  }
};