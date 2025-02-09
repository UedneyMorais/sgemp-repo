const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const validate = require('../middlewares/validate');
const checkPermissions = require('../middlewares/permissions');
const { createUser, updateUser } = require('../validations/user');

/**
 * @swagger
 * tags:
 *   name: Cidades
 *   description: API de gerenciamento de cidades
 */

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Retorna todas as cidades com paginação
 *     tags: [Cidades]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: "Número da página (padrão: 1)"
 *       - in: query
 *         name: perPage
 *         schema:
 *           type: integer
 *           example: 10
 *         description: "Número de itens por página (padrão: 10)"
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *           example: 1
 *         description: "Filtrar cidades pelo ID"
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *           example: "Bebidas"
 *         description: "Filtrar cidades pelo nome parcial ou completo"
 *     responses:
 *       200:
 *         description: Lista paginada de cidades.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Número total de cidades encontradas.
 *                   example: 50
 *                 perPage:
 *                   type: integer
 *                   description: Número de cidades por página.
 *                   example: 10
 *                 currentPage:
 *                   type: integer
 *                   description: Página atual.
 *                   example: 1
 *                 lastPage:
 *                   type: integer
 *                   description: Última página disponível.
 *                   example: 5
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: ID da cidade.
 *                         example: 1
 *                       name:
 *                         type: string
 *                         description: Nome da cidade.
 *                         example: "Bebidas"
 *       404:
 *         description: Nenhuma cidade foi encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Nenhuma cidade foi encontrada."
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
router.get('/', userController.getUsers.bind(userController));

/**
 * @swagger
 * /user/all:
 *   get:
 *     summary: Retorna todas as cidades sem paginação
 *     tags: [Cidades]
 *     responses:
 *       200:
 *         description: Lista de todas as cidades ordenadas por nome.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID da cidade.
 *                     example: 1
 *                   name:
 *                     type: string
 *                     description: Nome da cidade.
 *                     example: "Bebidas"
 *       404:
 *         description: Nenhuma cidade foi encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Nenhuma cidade foi encontrada."
 *       500:
 *         description: Erro interno no servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erro ao buscar cidades."
 *                 error:
 *                   type: object
 *                   description: Detalhes do erro.
 */
router.get('/all', userController.getAllUsers.bind(userController));

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Retorna uma cidade específica pelo ID
 *     tags: [Cidades]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: O ID da cidade
 *     responses:
 *       200:
 *         description: Categoria retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID da cidade.
 *                   example: 1
 *                 name:
 *                   type: string
 *                   description: Nome da cidade.
 *                   example: "Bebidas"
 *       404:
 *         description: Categoria não encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Não foi encontrado a cidade com o ID: 1."
 *       500:
 *         description: Erro interno no servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Não foi possível buscar a cidade."
 *                 error:
 *                   type: object
 *                   description: Detalhes do erro.
 */
router.get('/:id', userController.getUserById.bind(userController));

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Cria uma nova cidade
 *     tags: [Cidades]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome da cidade
 *                 example: "Bebidas"
 *     responses:
 *       201:
 *         description: Categoria criada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID da cidade criada
 *                   example: 1
 *                 name:
 *                   type: string
 *                   description: Nome da cidade criada
 *                   example: "Bebidas"
 *       400:
 *         description: Dados inválidos ou cidade já existente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensagem de erro
 *                   example: "Erro ao criar cidade."
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Lista de erros encontrados
 *                   example: ["Nome da cidade é obrigatório.", "Nome da cidade já existe."]
 *       500:
 *         description: Erro interno no servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensagem de erro
 *                   example: "Não foi possível criar a cidade."
 */
router.post('/', validate(createUser), checkPermissions(['create']), userController.createUser.bind(userController));

/**
 * @swagger
 * /user/{id}:
 *   put:
 *     summary: Atualiza uma cidade existente
 *     tags: [Cidades]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: O ID da cidade a ser atualizada
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome da cidade
 *                 example: "Bebidas Não Alcoólicas"
 *     responses:
 *       200:
 *         description: Categoria atualizada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID da cidade
 *                   example: 1
 *                 name:
 *                   type: string
 *                   description: Nome atualizado da cidade
 *                   example: "Bebidas Não Alcoólicas"
 *       404:
 *         description: Categoria não encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Categoria não encontrada."
 *       400:
 *         description: Erro nos dados enviados.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erro nos dados enviados."
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Lista de erros encontrados
 *                   example: ["O campo 'name' é obrigatório."]
 *       500:
 *         description: Erro interno no servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Não foi possível atualizar a cidade."
 */
router.put('/:id', validate(updateUser), checkPermissions(['update']), userController.updateUser.bind(userController));

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Exclui uma cidade específica
 *     tags: [Cidades]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: O ID da cidade a ser excluída
 *     responses:
 *       200:
 *         description: Categoria excluída com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Confirmação de exclusão
 *                   example: "A cidade com o ID 1 foi excluída com sucesso."
 *       404:
 *         description: Categoria não encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensagem indicando que a cidade não foi encontrada
 *                   example: "A cidade com o ID 1 não foi encontrada."
 *       400:
 *         description: Erro devido a violação de restrições do banco de dados.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensagem de erro
 *                   example: "Erro ao excluir a cidade."
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["A cidade não pode ser excluída porque está associada a produtos."]
 *       500:
 *         description: Erro interno do servidor ao tentar excluir a cidade.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensagem de erro
 *                   example: "Erro interno ao tentar excluir a cidade."
 */
router.delete('/:id', checkPermissions(['delete']), userController.deleteUser.bind(userController));

/**
 * @swagger
 * /user/activate/{id}:
 *   patch:
 *     summary: Ativa uma cidade
 *     tags: [Cidades]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da cidade
 *     responses:
 *       200:
 *         description: Categoria ativada com sucesso
 *       404:
 *         description: Categoria não encontrada
 */
router.patch('/activate/:id', checkPermissions(['update']), userController.activateUser.bind(userController));

/**
 * @swagger
 * /user/deactivate/{id}:
 *   patch:
 *     summary: Desativa uma cidade
 *     tags: [Cidades]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da cidade
 *     responses:
 *       200:
 *         description: Categoria desativada com sucesso
 *       404:
 *         description: Categoria não encontrada
 */
router.patch('/deactivate/:id', checkPermissions(['update']), userController.deactivateUser.bind(userController));

module.exports = router;