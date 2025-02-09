const { sequelize } = require('../models');
const { verifyAccessToken, verifyRefreshToken } = require('../config/jwt');
const ActiveToken = require('../models/ActiveToken');

const authenticateToken = async (req, res, next) => {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];

    if (!token) {
        return res.status(401).send({ message: 'Token não fornecido' });
    }

    // const activeToken = await ActiveToken.findOne({ where: { token } });
    // if (!activeToken) {
    //     return res.status(403).send({ message: 'Token inválido ou revogado' });
    // }
    try {
        
        const user = verifyAccessToken(token);
        req.user = user;
        next();
    } catch (error) {
        return res.status(403).send({ message: 'Token inválido ou expirado' });
    }
  
};

const refreshToken = async (req, res) => {
    const refreshToken = req.body.refreshToken;

    if (!refreshToken) {
        return res.status(400).send({ message: 'Refresh token não fornecido' });
    }

    try {
        const userData = verifyRefreshToken(refreshToken);

        const activeToken = await ActiveToken.findOne({ where: { token: refreshToken } });
        if (!activeToken) {
            return res.status(403).send({ message: 'Refresh token inválido ou revogado' });
        }

        const accessToken = generateAccessToken(userData);
        const newRefreshToken = generateRefreshToken(userData);

        await ActiveToken.update({ token: newRefreshToken }, { where: { token: refreshToken } });

        return res.status(200).send({ accessToken, refreshToken: newRefreshToken });
    } catch (error) {
        return res.status(403).send({ message: 'Refresh token inválido ou expirado' });
    }
};

module.exports = { authenticateToken, refreshToken };
