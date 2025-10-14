// backend/src/config/database.js
const { Pool } = require('pg');

const pool = new Pool({
  user: 'admin',          // Seu usuário do banco
  password: '11223344',       // Sua senha do banco
  host: 'localhost',          // O Docker expõe o banco no localhost
  port: 5439,                 // A porta que você mapeou
  database: 'rpg_database',   // O nome do seu banco de dados
});

module.exports = {
  pool
};