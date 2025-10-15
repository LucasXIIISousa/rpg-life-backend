// backend/src/config/passport.js

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { pool } = require('./database'); // Importa nossa pool de conexão

passport.use(new GoogleStrategy({
    // Lê as credenciais do arquivo .env
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3001/api/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    // Esta função é chamada automaticamente pelo Passport após o Google autenticar o usuário com sucesso.
    // 'profile' contém as informações do usuário vindas do Google.
    
    const { id, displayName, emails } = profile;
    const email = emails[0].value;

    try {
      // 1. Verifica se o usuário já existe no nosso banco de dados usando o e-mail
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      let user = result.rows[0];

      if (user) {
        // 2a. Se o usuário já existe, o processo de autenticação está completo.
        // A função 'done' passa o controle adiante com o usuário encontrado.
        return done(null, user);
      } else {
        // 2b. Se o usuário não existe, nós o criamos na nossa tabela 'users'.
        // A senha pode ser um valor fixo ou aleatório, pois este usuário só fará login via Google.
        const newUserResult = await pool.query(
          'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
          [displayName, email, 'google_authenticated'] // Usamos um placeholder para a senha
        );
        user = newUserResult.rows[0];

        // O processo de autenticação está completo, retornando o novo usuário criado.
        return done(null, user);
      }
    } catch (err) {
      // Em caso de erro no banco de dados, a autenticação falha.
      return done(err, null);
    }
  }
));