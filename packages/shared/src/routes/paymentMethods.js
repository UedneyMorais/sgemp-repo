const express = require('express');
const router = express.Router();
const paymentMethodController = require('../controllers/paymentMethodController');
const validate = require('../middlewares/validate');
const checkPermissions = require('../middlewares/permissions');
const { createPaymentMethod, updatePaymentMethod } = require('../validations/paymentMethod');

/**
 * @swagger
 * tags:
 *   name: Formas de Pagamento
 *   description: API de gerenciamento de formas de pagamento
 */

/**
 * @swagger
 * /paymentMethod:
 *   get:
 *     summary: Retorna todas as formas de pagamento com paginação
 *     tags: [Formas de Pagamento]
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
 *         description: "Filtrar formas de pagamento pelo ID"
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *           example: "Bebidas"
 *         description: "Filtrar formas de pagamento pelo nome parcial ou completo"
 *     responses:
 *       200:
 *         description: Lista paginada de formas de pagamento.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Número total de formas de pagamento encontradas.
 *                   example: 50
 *                 perPage:
 *                   type: integer
 *                   description: Número de formas de pagamento por página.
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
 *                         description: ID da forma de pagamento.
 *                         example: 1
 *                       paymentMethodName:
 *                         type: string
 *                         description: Nome da forma de pagamento.
 *                         example: "Bebidas"
 *       404:
 *         description: Nenhuma forma de pagamento foi encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Nenhuma forma de pagamento foi encontrada."
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
router.get('/', paymentMethodController.getPaymentMethods.bind(paymentMethodController));

/**
 * @swagger
 * /paymentMethod/all:
 *   get:
 *     summary: Retorna todas as formas de pagamento sem paginação
 *     tags: [Formas de Pagamento]
 *     responses:
 *       200:
 *         description: Lista de todas as formas de pagamento ordenadas por nome.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID da forma de pagamento.
 *                     example: 1
 *                   paymentMethodName:
 *                     type: string
 *                     description: Nome da forma de pagamento.
 *                     example: "Bebidas"
 *       404:
 *         description: Nenhuma forma de pagamento foi encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Nenhuma forma de pagamento foi encontrada."
 *       500:
 *         description: Erro interno no servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erro ao buscar formas de pagamento."
 *                 error:
 *                   type: object
 *                   description: Detalhes do erro.
 */
router.get('/all', paymentMethodController.getAllPaymentMethods.bind(paymentMethodController));

/**
 * @swagger
 * /paymentMethod/{id}:
 *   get:
 *     summary: Retorna uma forma de pagamento específica pelo ID
 *     tags: [Formas de Pagamento]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: O ID da forma de pagamento
 *     responses:
 *       200:
 *         description: Forma de Pagamento retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID da forma de pagamento.
 *                   example: 1
 *                 paymentMethodName:
 *                   type: string
 *                   description: Nome da forma de pagamento.
 *                   example: "Bebidas"
 *       404:
 *         description: Forma de Pagamento não encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Não foi encontrado a forma de pagamento com o ID: 1."
 *       500:
 *         description: Erro interno no servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Não foi possível buscar a forma de pagamento."
 *                 error:
 *                   type: object
 *                   description: Detalhes do erro.
 */
router.get('/:id', paymentMethodController.getPaymentMethodById.bind(paymentMethodController));

/**
 * @swagger
 * /paymentMethod:
 *   post:
 *     summary: Cria uma nova forma de pagamento
 *     tags: [Formas de Pagamento]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentMethodName:
 *                 type: string
 *                 description: Nome da forma de pagamento
 *                 example: "Bebidas"
 *     responses:
 *       201:
 *         description: Forma de Pagamento criada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID da forma de pagamento criada
 *                   example: 1
 *                 paymentMethodName:
 *                   type: string
 *                   description: Nome da forma de pagamento criada
 *                   example: "Bebidas"
 *       400:
 *         description: Dados inválidos ou forma de pagamento já existente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensagem de erro
 *                   example: "Erro ao criar forma de pagamento."
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Lista de erros encontrados
 *                   example: ["Nome da forma de pagamento é obrigatório.", "Nome da forma de pagamento já existe."]
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
 *                   example: "Não foi possível criar a forma de pagamento."
 */
router.post('/', validate(createPaymentMethod), checkPermissions(['create']), paymentMethodController.createPaymentMethod.bind(paymentMethodController));

/**
 * @swagger
 * /paymentMethod/{id}:
 *   put:
 *     summary: Atualiza uma forma de pagamento existente
 *     tags: [Formas de Pagamento]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: O ID da forma de pagamento a ser atualizada
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentMethodName:
 *                 type: string
 *                 description: Nome da forma de pagamento
 *                 example: "Bebidas Não Alcoólicas"
 *     responses:
 *       200:
 *         description: Forma de Pagamento atualizada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID da forma de pagamento
 *                   example: 1
 *                 paymentMethodName:
 *                   type: string
 *                   description: Nome atualizado da forma de pagamento
 *                   example: "Bebidas Não Alcoólicas"
 *       404:
 *         description: Forma de Pagamento não encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Forma de Pagamento não encontrada."
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
 *                   example: ["O campo 'nome' é obrigatório."]
 *       500:
 *         description: Erro interno no servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Não foi possível atualizar a forma de pagamento."
 */
router.put('/:id', validate(updatePaymentMethod), checkPermissions(['update']), paymentMethodController.updatePaymentMethod.bind(paymentMethodController));

/**
 * @swagger
 * /paymentMethod/{id}:
 *   delete:
 *     summary: Exclui uma forma de pagamento específica
 *     tags: [Formas de Pagamento]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: O ID da forma de pagamento a ser excluída
 *     responses:
 *       200:
 *         description: Forma de Pagamento excluída com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Confirmação de exclusão
 *                   example: "A forma de pagamento com o ID 1 foi excluída com sucesso."
 *       404:
 *         description: Forma de Pagamento não encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensagem indicando que a forma de pagamento não foi encontrada
 *                   example: "A forma de pagamento com o ID 1 não foi encontrada."
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
 *                   example: "Erro ao excluir a forma de pagamento."
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["A forma de pagamento não pode ser excluída porque está associada a produtos."]
 *       500:
 *         description: Erro interno do servidor ao tentar excluir a forma de pagamento.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensagem de erro
 *                   example: "Erro interno ao tentar excluir a forma de pagamento."
 */
router.delete('/:id', checkPermissions(['delete']), paymentMethodController.deletePaymentMethod.bind(paymentMethodController));

/**
 * @swagger
 * /paymentMethod/activate/{id}:
 *   patch:
 *     summary: Ativa uma forma de pagamento
 *     tags: [Formas de Pagamento]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da forma de pagamento
 *     responses:
 *       200:
 *         description: Forma de Pagamento ativada com sucesso
 *       404:
 *         description: Forma de Pagamento não encontrada
 */
router.patch('/activate/:id', checkPermissions(['update']), paymentMethodController.activatePaymentMethod.bind(paymentMethodController));

/**
 * @swagger
 * /paymentMethod/deactivate/{id}:
 *   patch:
 *     summary: Desativa uma forma de pagamento
 *     tags: [Formas de Pagamento]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da forma de pagamento
 *     responses:
 *       200:
 *         description: Forma de Pagamento desativada com sucesso
 *       404:
 *         description: Forma de Pagamento não encontrada
 */
router.patch('/deactivate/:id', checkPermissions(['update']), paymentMethodController.deactivatePaymentMethod.bind(paymentMethodController));

module.exports = router;