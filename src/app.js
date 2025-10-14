// backend/src/app.js
const express = require('express');
const cors = require('cors');
const { pool } = require('./config/database');
const authRoutes = require('./routes/auth.routes'); // <-- 1. IMPORTAR AS ROTAS

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Rota de teste
app.get('/', (req, res) => {
  res.send('API do RPG Gamification está no ar!');
});

// <-- 2. USAR AS ROTAS DE AUTENTICAÇÃO
// Todas as rotas definidas em auth.routes.js terão o prefixo /api/auth
app.use('/api/auth', authRoutes);


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