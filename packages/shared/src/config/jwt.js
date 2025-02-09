const jwt = require('jsonwebtoken');

 const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
 const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'default_secret_refresh';; 

 if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
    console.error('ERRO: As variáveis JWT_SECRET ou JWT_REFRESH_SECRET não estão definidas.');
    process.exit(1);
}

const generateAccessToken = (user) => {
    return jwt.sign({ sub: user.id, profile: user.profile, permissions: user.permissions }, JWT_SECRET, {
        expiresIn: '1h' 
    });
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        { sub: user.id },
        JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
    );
};


const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        throw new Error('Access token inválido ou expirado.');
    }
};

const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, JWT_REFRESH_SECRET);
    } catch (error) {
        throw new Error('Refresh token inválido ou expirado.');
    }
};

module.exports = { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken,};
