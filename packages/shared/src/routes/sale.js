const express = require('express');
const router = express.Router();
const saleController = require('../controllers/saleController');
const validate = require('../middlewares/validate');
const checkPermissions = require('../middlewares/permissions');
const { createSale, updateSale } = require('../validations/sale');

/**
 * @swagger
 * tags:
 *   name: Vendas
 *   description: API de gerenciamento de vendas
 */

/**
 * @swagger
 * /sale:
 *   get:
 *     summary: Retorna todas as vendas com paginação
 *     tags: [Vendas]
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
 *         description: "Filtrar vendas pelo ID"
 *       - in: query
 *         name: saleName
 *         schema:
 *           type: string
 *           example: "Bebidas"
 *         description: "Filtrar vendas pelo nome parcial ou completo"
 *     responses:
 *       200:
 *         description: Lista paginada de vendas.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Número total de vendas encontradas.
 *                   example: 50
 *                 perPage:
 *                   type: integer
 *                   description: Número de vendas por página.
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
 *                         description: ID da venda.
 *                         example: 1
 *                       saleName:
 *                         type: string
 *                         description: Nome da venda.
 *                         example: "Bebidas"
 *       404:
 *         description: Nenhuma venda foi encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Nenhuma venda foi encontrada."
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
router.get('/', saleController.getSales.bind(saleController));

/**
 * @swagger
 * /sale/all:
 *   get:
 *     summary: Retorna todas as vendas sem paginação
 *     tags: [Vendas]
 *     responses:
 *       200:
 *         description: Lista de todas as vendas ordenadas por nome.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID da venda.
 *                     example: 1
 *                   saleName:
 *                     type: string
 *                     description: Nome da venda.
 *                     example: "Bebidas"
 *       404:
 *         description: Nenhuma venda foi encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Nenhuma venda foi encontrada."
 *       500:
 *         description: Erro interno no servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erro ao buscar vendas."
 *                 error:
 *                   type: object
 *                   description: Detalhes do erro.
 */
router.get('/all', saleController.getAllSales.bind(saleController));

/**
 * @swagger
 * /sale/{id}:
 *   get:
 *     summary: Retorna uma venda específica pelo ID
 *     tags: [Vendas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: O ID da venda
 *     responses:
 *       200:
 *         description: Venda retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID da venda.
 *                   example: 1
 *                 saleName:
 *                   type: string
 *                   description: Nome da venda.
 *                   example: "Bebidas"
 *       404:
 *         description: Venda não encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Não foi encontrado a venda com o ID: 1."
 *       500:
 *         description: Erro interno no servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Não foi possível buscar a venda."
 *                 error:
 *                   type: object
 *                   description: Detalhes do erro.
 */
router.get('/:id', saleController.getSaleById.bind(saleController));

/**
 * @swagger
 * /sale:
 *   post:
 *     summary: Cria uma nova venda
 *     tags: [Vendas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               saleName:
 *                 type: string
 *                 description: Nome da venda
 *                 example: "Bebidas"
 *     responses:
 *       201:
 *         description: Venda criada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID da venda criada
 *                   example: 1
 *                 saleName:
 *                   type: string
 *                   description: Nome da venda criada
 *                   example: "Bebidas"
 *       400:
 *         description: Dados inválidos ou venda já existente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensagem de erro
 *                   example: "Erro ao criar venda."
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Lista de erros encontrados
 *                   example: ["Nome da venda é obrigatório.", "Nome da venda já existe."]
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
 *                   example: "Não foi possível criar a venda."
 */
router.post('/', validate(createSale), checkPermissions(['create']), saleController.createSale.bind(saleController));

//validate(createSale), 

/**
 * @swagger
 * /sale/{id}:
 *   put:
 *     summary: Atualiza uma venda existente
 *     tags: [Vendas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: O ID da venda a ser atualizada
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               saleName:
 *                 type: string
 *                 description: Nome da venda
 *                 example: "Bebidas Não Alcoólicas"
 *     responses:
 *       200:
 *         description: Venda atualizada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID da venda
 *                   example: 1
 *                 saleName:
 *                   type: string
 *                   description: Nome atualizado da venda
 *                   example: "Bebidas Não Alcoólicas"
 *       404:
 *         description: Venda não encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Venda não encontrada."
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
 *                   example: ["O campo 'saleName' é obrigatório."]
 *       500:
 *         description: Erro interno no servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Não foi possível atualizar a venda."
 */
router.put('/:id', validate(updateSale), checkPermissions(['update']), saleController.updateSale.bind(saleController));

/**
 * @swagger
 * /sale/{id}:
 *   delete:
 *     summary: Exclui uma venda específica
 *     tags: [Vendas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: O ID da venda a ser excluída
 *     responses:
 *       200:
 *         description: Venda excluída com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Confirmação de exclusão
 *                   example: "A venda com o ID 1 foi excluída com sucesso."
 *       404:
 *         description: Venda não encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensagem indicando que a venda não foi encontrada
 *                   example: "A venda com o ID 1 não foi encontrada."
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
 *                   example: "Erro ao excluir a venda."
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["A venda não pode ser excluída porque está associada a produtos."]
 *       500:
 *         description: Erro interno do servidor ao tentar excluir a venda.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensagem de erro
 *                   example: "Erro interno ao tentar excluir a venda."
 */
router.delete('/:id', checkPermissions(['delete']), saleController.deleteSale.bind(saleController));

/**
 * @swagger
 * /sale/activate/{id}:
 *   patch:
 *     summary: Ativa uma venda
 *     tags: [Vendas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da venda
 *     responses:
 *       200:
 *         description: Venda ativada com sucesso
 *       404:
 *         description: Venda não encontrada
 */
router.patch('/activate/:id', checkPermissions(['update']), saleController.activateSale.bind(saleController));

/**
 * @swagger
 * /sale/deactivate/{id}:
 *   patch:
 *     summary: Desativa uma venda
 *     tags: [Vendas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da venda
 *     responses:
 *       200:
 *         description: Venda desativada com sucesso
 *       404:
 *         description: Venda não encontrada
 */
router.patch('/deactivate/:id', checkPermissions(['update']), saleController.deactivateSale.bind(saleController));

module.exports = router;