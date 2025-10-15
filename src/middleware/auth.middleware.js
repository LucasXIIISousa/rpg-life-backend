// backend/src/middleware/auth.middleware.js
const jwt = require('jsonwebtoken');

// A mesma chave secreta que usamos para criar o token
const SECRET_KEY = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
  // 1. Pega o cabeçalho 'Authorization' da requisição
  const authHeader = req.headers['authorization'];
  
  // 2. O token vem no formato "Bearer TOKEN". Nós separamos para pegar só o token.
  const token = authHeader && authHeader.split(' ')[1];

  // 3. Se não houver token, o acesso é negado
  if (token == null) {
    return res.status(401).json({ error: 'Acesso negado. Nenhum token fornecido.' });
  }

  // 4. Verifica se o token é válido
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      // Se o token for inválido (expirado, etc.), o acesso é proibido
      return res.status(403).json({ error: 'Token inválido ou expirado.' });
    }
    
    // 5. Se o token for válido, adicionamos os dados do usuário (o payload do token) na requisição
    req.user = user;
    
    // 6. Chama a próxima função (o controlador da rota)
    next();
  });
};

module.exports = authenticateToken;