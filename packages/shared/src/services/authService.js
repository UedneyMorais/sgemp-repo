const bcrypt = require('bcrypt');
const { User, ActiveToken } = require('../models');
const { verifyRefreshToken, generateAccessToken, generateRefreshToken } = require('../config/jwt');

class LoginService {
    
  async login(email, password) {
        const user = await User.findOne({ where: { email } });

        if (!user) {
          throw new Error('Usuário não encontrado');
        }

        if (!user.active) {
          throw new Error('Usuário está inativo');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          throw new Error('Senha incorreta');
        }

        user.permissions = user.profile === 'admin'
          ? ['create', 'read', 'update', 'delete']
          : ['read'];

        
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        await ActiveToken.create({
          token: refreshToken,
          userId: user.id,
          type: 'refresh_token',
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        return { accessToken, refreshToken };
    }

    async logout(token) {
        const deleted = await ActiveToken.destroy({ where: { token } });
        return deleted > 0;
    }


    async refresh(refreshToken) {

      console.log()
      // Verificar validade do refresh token
      const verifiedRefreshToken = verifyRefreshToken(refreshToken);
  
      // Garantir que o refresh token está ativo no banco
      const activeRefreshToken = await ActiveToken.findOne({
          where: { token: refreshToken, type: 'refresh_token' },
      });
  
      if (!activeRefreshToken) {
          throw new Error('Refresh token inválido ou revogado');
      }
  
      // Buscar informações do usuário
      const user = await User.findOne({ where: { id: verifiedRefreshToken.sub } });
  
      if (!user) {
          throw new Error('Usuário associado ao token não encontrado');
      }
  
      // Gerar novos tokens
      const newAccessToken = generateAccessToken(user);
      const newRefreshToken = generateRefreshToken(user);
  
      // Atualizar o refresh token no banco
      await ActiveToken.update(
          { token: newRefreshToken, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
          { where: { token: refreshToken } }
      );
  
      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }
  
}

module.exports = new LoginService();
