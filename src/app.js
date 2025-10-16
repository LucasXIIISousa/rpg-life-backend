// backend/src/app.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const passport = require('passport'); 
const { pool } = require('./config/database');
const authRoutes = require('./routes/auth.routes');
const characterRoutes = require('./routes/character.routes');

require('./config/passport'); 

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(passport.initialize()); 

// Rota de teste
app.get('/', (req, res) => {
  res.send('API do RPG Gamification está no ar!');
});

// Usar as rotas de autenticação
app.use('/api/auth', authRoutes);
app.use('/api/characters', characterRoutes); 

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