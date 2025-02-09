const authService = require('../services/authService');

class AuthController {

    async login(req, res, next) {
        try {
          const { email, password } = req.body;

          const { accessToken, refreshToken } = await authService.login(email, password);

          res.cookie('refresh_token', refreshToken, {
            httpOnly: false,            // Evita acesso via JavaScript
            secure: true,              // Somente em conexões HTTPS
            sameSite: 'None',          // Necessário para CORS
            maxAge: 7 * 24 * 60 * 60 * 1000, // Expira em 7 dias
            path: '/',                 // Disponível para todas as rotas
          });

          res.set(
            {
              "access_token": accessToken,
              "refresh_token": refreshToken
            }
          )
    
          res.status(200).send({});
        } catch (error) {
           
          if(error.message.includes("inativo")){
            res.status(403).send({
              "message": error.message
            });
            return;
          }

          if(error.message.includes("encontrado")){
            res.status(404).send({
              "message": error.message
            });
            return;
          }
          if(error.message.includes("incorreta")){
            res.status(401).send({
              "message": error.message
            });
            return;
          }
          
          if(!error.message.includes("inativo") || !error.message.includes("encontrado") || !error.message.includes("incorreta")){
            next(error);
          }

        }
    }

    async logout(req, res, next) {
        try {
            const token = req.headers['authorization']?.split(' ')[1];
      
            if (!token) {
              return res.status(401).send({ message: 'Token não fornecido' });
            }
      
            const isLoggedOut = await authService.logout(token);
      
            if (isLoggedOut) {
              return res.status(200).send({ message: 'Logout bem-sucedido' });
            } else {
              return res.status(401).send({ message: 'Token inválido ou já expirado' });
            }
          } catch (error) {
            next(error);
          }
    }
    
    async refresh(req, res, next) {
        try {

          console.log("🔍 Headers da requisição:", req.headers);

        // Extrair o valor do cookie 'refresh_token'
        const cookies = req.headers.cookie?.split('; ') || [];
        const refreshTokenByCookie = cookies
            .find((cookie) => cookie.startsWith('refresh_token='))
            ?.split('=')[1];

           // Captura o refresh_token vindo nos headers
        const refreshTokenByHeader = req.headers['refresh_token']; 

        console.log("🔹 refresh_token do Cookie:", refreshTokenByCookie);
        console.log("🔹 refresh_token do Header:", refreshTokenByHeader);

          if (!refreshTokenByCookie && !refreshTokenByHeader) {
            return res.status(400).send({ message: 'Refresh token não fornecido' });
          }
      
          const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await authService.refresh(refreshTokenByCookie ?? refreshTokenByHeader.replace('refresh_token=', ''));
      
          const accessToken = newAccessToken;
          const refreshToken = newRefreshToken;


          console.log(accessToken)
          console.log(refreshToken)
          res.cookie('refresh_token', refreshToken, {
            httpOnly: true,            // Evita acesso via JavaScript
            secure: true,              // Somente em conexões HTTPS
            sameSite: 'None',          // Necessário para CORS
            maxAge: 7 * 24 * 60 * 60 * 1000, // Expira em 7 dias
            path: '/',                 // Disponível para todas as rotas
        });

        res.set(
          {
            "access_token": accessToken,
            "refresh_token": refreshToken
          }
        )
  
        res.status(200).send({ accessToken, refreshToken });
        } catch (error) {
          console.error('Erro ao processar refresh token:', error);
          res.status(403).send({ message: 'Refresh token inválido ou expirado' });
        }
    }
}

module.exports = new AuthController();