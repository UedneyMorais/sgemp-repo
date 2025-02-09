const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const validate = require('../middlewares/validate');
const checkPermissions = require('../middlewares/permissions');
const { createCategory, updateCategory } = require('../validations/category');

/**
 * @swagger
 * tags:
 *   name: Categorias
 *   description: API de gerenciamento de categorias
 */

/**
 * @swagger
 * /category:
 *   get:
 *     summary: Retorna todas as categorias com paginação
 *     tags: [Categorias]
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
 *         description: "Filtrar categorias pelo ID"
 *       - in: query
 *         name: categoryName
 *         schema:
 *           type: string
 *           example: "Bebidas"
 *         description: "Filtrar categorias pelo nome parcial ou completo"
 *     responses:
 *       200:
 *         description: Lista paginada de categorias.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Número total de categorias encontradas.
 *                   example: 50
 *                 perPage:
 *                   type: integer
 *                   description: Número de categorias por página.
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
 *                         description: ID da categoria.
 *                         example: 1
 *                       categoryName:
 *                         type: string
 *                         description: Nome da categoria.
 *                         example: "Bebidas"
 *       404:
 *         description: Nenhuma categoria foi encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Nenhuma categoria foi encontrada."
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
router.get('/', categoryController.getCategories.bind(categoryController));

/**
 * @swagger
 * /category/all:
 *   get:
 *     summary: Retorna todas as categorias sem paginação
 *     tags: [Categorias]
 *     responses:
 *       200:
 *         description: Lista de todas as categorias ordenadas por nome.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID da categoria.
 *                     example: 1
 *                   categoryName:
 *                     type: string
 *                     description: Nome da categoria.
 *                     example: "Bebidas"
 *       404:
 *         description: Nenhuma categoria foi encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Nenhuma categoria foi encontrada."
 *       500:
 *         description: Erro interno no servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erro ao buscar categorias."
 *                 error:
 *                   type: object
 *                   description: Detalhes do erro.
 */
router.get('/all', categoryController.getAllCategories.bind(categoryController));

/**
 * @swagger
 * /category/{id}:
 *   get:
 *     summary: Retorna uma categoria específica pelo ID
 *     tags: [Categorias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: O ID da categoria
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
 *                   description: ID da categoria.
 *                   example: 1
 *                 categoryName:
 *                   type: string
 *                   description: Nome da categoria.
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
 *                   example: "Não foi encontrado a categoria com o ID: 1."
 *       500:
 *         description: Erro interno no servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Não foi possível buscar a categoria."
 *                 error:
 *                   type: object
 *                   description: Detalhes do erro.
 */
router.get('/:id', categoryController.getCategoryById.bind(categoryController));

/**
 * @swagger
 * /category:
 *   post:
 *     summary: Cria uma nova categoria
 *     tags: [Categorias]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoryName:
 *                 type: string
 *                 description: Nome da categoria
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
 *                   description: ID da categoria criada
 *                   example: 1
 *                 categoryName:
 *                   type: string
 *                   description: Nome da categoria criada
 *                   example: "Bebidas"
 *       400:
 *         description: Dados inválidos ou categoria já existente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensagem de erro
 *                   example: "Erro ao criar categoria."
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Lista de erros encontrados
 *                   example: ["Nome da categoria é obrigatório.", "Nome da categoria já existe."]
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
 *                   example: "Não foi possível criar a categoria."
 */
router.post('/', validate(createCategory), checkPermissions(['create']), categoryController.createCategory.bind(categoryController));

/**
 * @swagger
 * /category/{id}:
 *   put:
 *     summary: Atualiza uma categoria existente
 *     tags: [Categorias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: O ID da categoria a ser atualizada
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoryName:
 *                 type: string
 *                 description: Nome da categoria
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
 *                   description: ID da categoria
 *                   example: 1
 *                 categoryName:
 *                   type: string
 *                   description: Nome atualizado da categoria
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
 *                   example: ["O campo 'categoryName' é obrigatório."]
 *       500:
 *         description: Erro interno no servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Não foi possível atualizar a categoria."
 */
router.put('/:id', validate(updateCategory), checkPermissions(['update']), categoryController.updateCategory.bind(categoryController));

/**
 * @swagger
 * /category/{id}:
 *   delete:
 *     summary: Exclui uma categoria específica
 *     tags: [Categorias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: O ID da categoria a ser excluída
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
 *                   example: "A categoria com o ID 1 foi excluída com sucesso."
 *       404:
 *         description: Categoria não encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensagem indicando que a categoria não foi encontrada
 *                   example: "A categoria com o ID 1 não foi encontrada."
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
 *                   example: "Erro ao excluir a categoria."
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["A categoria não pode ser excluída porque está associada a produtos."]
 *       500:
 *         description: Erro interno do servidor ao tentar excluir a categoria.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensagem de erro
 *                   example: "Erro interno ao tentar excluir a categoria."
 */
router.delete('/:id', checkPermissions(['delete']), categoryController.deleteCategory.bind(categoryController));

/**
 * @swagger
 * /category/activate/{id}:
 *   patch:
 *     summary: Ativa uma categoria
 *     tags: [Categorias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da categoria
 *     responses:
 *       200:
 *         description: Categoria ativada com sucesso
 *       404:
 *         description: Categoria não encontrada
 */
router.patch('/activate/:id', checkPermissions(['update']), categoryController.activateCategory.bind(categoryController));

/**
 * @swagger
 * /category/deactivate/{id}:
 *   patch:
 *     summary: Desativa uma categoria
 *     tags: [Categorias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da categoria
 *     responses:
 *       200:
 *         description: Categoria desativada com sucesso
 *       404:
 *         description: Categoria não encontrada
 */
router.patch('/deactivate/:id', checkPermissions(['update']), categoryController.deactivateCategory.bind(categoryController));

module.exports = router;