require('dotenv').config();

const express = require('express');
const cors = require('cors');
const passport = require('passport');
const { pool } = require('./config/database');

// --- Imports de Rotas ---
const authRoutes = require('./routes/auth.routes');
const characterRoutes = require('./routes/character.routes');
const questRoutes = require('./routes/quest.routes');

// --- Configurações ---
require('./config/passport');

const app = express();
const PORT = process.env.PORT || 3001;

// --- Middlewares Globais ---
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// --- Rotas da Aplicação ---
app.use('/api/auth', authRoutes);
app.use('/api/characters', characterRoutes);
app.use('/api/quests', questRoutes);

// --- Inicialização do Servidor ---
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  pool.query('SELECT NOW()', (err, res) => {
    if (err) {
      console.error('Erro ao conectar com o PostgreSQL', err.stack);
    } else {
      console.log('Conectado ao PostgreSQL com sucesso!');
    }
  });
});