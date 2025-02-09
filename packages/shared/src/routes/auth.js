const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API de autenticação e login
 */

/**
 * @swagger
 * /auth:
 *   post:
 *     summary: Faz login com e-mail e senha
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: E-mail do usuário
 *                 example: "exemplo@dominio.com"
 *               password:
 *                 type: string
 *                 description: Senha do usuário
 *                 example: "senhaSegura123"
 *     responses:
 *       200:
 *         description: Login bem-sucedido. Retorna tokens de autenticação.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: Token de acesso (JWT)
 *                   example: "eyJhbGciOiJIUzI1..."
 *                 refreshToken:
 *                   type: string
 *                   description: Token de atualização
 *                   example: "eyJhbGciOiJIUzI1..."
 *       401:
 *         description: Usuário não encontrado ou senha incorreta.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuário não encontrado ou senha incorreta."
 *       500:
 *         description: Erro interno no servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erro interno no servidor."
 */
router.post('/', authController.login.bind(authController));

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Faz o logout do usuário, removendo o token ativo
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout bem-sucedido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Logout bem-sucedido."
 *       401:
 *         description: Token não fornecido ou inválido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token não fornecido ou inválido."
 *       500:
 *         description: Erro interno no servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erro interno no servidor."
 */
router.post('/logout', authController.logout.bind(authController));

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Gera um novo token de acesso com base no refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Refresh token do usuário
 *                 example: "eyJhbGciOiJIUzI1..."
 *     responses:
 *       200:
 *         description: Novo token de acesso gerado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: Novo token de acesso
 *                   example: "eyJhbGciOiJIUzI1..."
 *                 refreshToken:
 *                   type: string
 *                   description: Novo refresh token
 *                   example: "eyJhbGciOiJIUzI1..."
 *       403:
 *         description: Refresh token inválido ou revogado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Refresh token inválido ou revogado."
 *       500:
 *         description: Erro interno no servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erro interno no servidor."
 */
router.post('/refresh', authController.refresh.bind(authController));

module.exports = router;
