const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const validate = require('../middlewares/validate');
const checkPermissions = require('../middlewares/permissions');
const { createProduct, updateProduct } = require('../validations/product');

/**
 * @swagger
 * tags:
 *   name: Produtos
 *   description: API de gerenciamento de produtos
 */

/**
 * @swagger
 * /product:
 *   get:
 *     summary: Retorna todos os produtos com suas produtos associadas
 *     tags: [Produtos]
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
 *         name: description
 *         schema:
 *           type: string
 *           example: "Café"
 *         description: Descrição parcial ou completa do produto para filtro
 *       - in: query
 *         name: ean
 *         schema:
 *           type: string
 *           example: "7891234567890"
 *         description: Código EAN do produto para filtro
 *     responses:
 *       200:
 *         description: Lista paginada de produtos com produtos associadas.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Número total de produtos encontrados.
 *                   example: 50
 *                 perPage:
 *                   type: integer
 *                   description: Número de produtos por página.
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
 *                         description: ID do produto
 *                         example: 9
 *                       description:
 *                         type: string
 *                         description: Descrição do produto
 *                         example: "Café Expresso Torrado"
 *                       price:
 *                         type: number
 *                         format: float
 *                         description: Preço do produto
 *                         example: 12.50
 *                       cfop:
 *                         type: string
 *                         description: Código Fiscal de Operações e Prestações
 *                         example: "5102"
 *                       ean:
 *                         type: string
 *                         description: Código EAN do produto
 *                         example: "7891234567890"
 *                       dtvenc:
 *                         type: string
 *                         format: date
 *                         description: Data de vencimento do produto
 *                         example: "2025-12-31"
 *                       unitType:
 *                         type: string
 *                         description: Unidade de medida do produto
 *                         example: "UN"
 *                       cstCsosn:
 *                         type: string
 *                         description: Código CST/CSOSN do produto
 *                         example: "0102"
 *                       perIcms:
 *                         type: number
 *                         format: float
 *                         description: Percentual do ICMS
 *                         example: 18
 *                       category:
 *                         type: object
 *                         description: Dados da produto associada ao produto
 *                         properties:
 *                           id:
 *                             type: integer
 *                             description: ID da produto
 *                             example: 1
 *                           name:
 *                             type: string
 *                             description: Nome da produto
 *                             example: "Bebidas"
 *       404:
 *         description: Nenhum produto foi encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Nenhum produto foi encontrado."
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
router.get('/', productController.getProducts.bind(productController));

/**
 * @swagger
 * /product/all:
 *   get:
 *     summary: Retorna todos os produtos sem paginação
 *     tags: [Produtos]
 *     responses:
 *       200:
 *         description: Lista de todos as produtos ordenadas por nome.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: ID do produto
 *                         example: 9
 *                       description:
 *                         type: string
 *                         description: Descrição do produto
 *                         example: "Café Expresso Torrado"
 *                       price:
 *                         type: number
 *                         format: float
 *                         description: Preço do produto
 *                         example: 12.50
 *                       cfop:
 *                         type: string
 *                         description: Código Fiscal de Operações e Prestações
 *                         example: "5102"
 *                       ean:
 *                         type: string
 *                         description: Código EAN do produto
 *                         example: "7891234567890"
 *                       dtvenc:
 *                         type: string
 *                         format: date
 *                         description: Data de vencimento do produto
 *                         example: "2025-12-31"
 *                       unitType:
 *                         type: string
 *                         description: Unidade de medida do produto
 *                         example: "UN"
 *                       cstCsosn:
 *                         type: string
 *                         description: Código CST/CSOSN do produto
 *                         example: "0102"
 *                       perIcms:
 *                         type: number
 *                         format: float
 *                         description: Percentual do ICMS
 *                         example: 18
 *                       category:
 *                         type: object
 *                         description: Dados da produto associada ao produto
 *                         properties:
 *                           id:
 *                             type: integer
 *                             description: ID da produto
 *                             example: 1
 *                           name:
 *                             type: string
 *                             description: Nome da produto
 *                             example: "Bebidas"
 *       404:
 *         description: Nenhuma produto foi encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Nenhuma produto foi encontrada."
 *       500:
 *         description: Erro interno no servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erro ao buscar produtos."
 *                 error:
 *                   type: object
 *                   description: Detalhes do erro.
 */
router.get('/all', productController.getAllProducts.bind(productController));

/**
 * @swagger
 * /product/{id}:
 *   get:
 *     summary: Retorna um produto específico pelo ID
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: O ID do produto
 *     responses:
 *       200:
 *         description: Produto retornado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID do produto
 *                   example: 1
 *                 description:
 *                   type: string
 *                   description: Descrição do produto
 *                   example: "Café Expresso Torrado"
 *                 price:
 *                   type: number
 *                   description: Preço do produto
 *                   example: 12.50
 *                 cfop:
 *                   type: string
 *                   description: Código Fiscal de Operações e Prestações
 *                   example: "5102"
 *                 ean:
 *                   type: string
 *                   description: Código EAN do produto
 *                   example: "7891234567890"
 *                 dtvenc:
 *                   type: string
 *                   format: date
 *                   description: Data de vencimento do produto
 *                   example: "2025-12-31"
 *                 unitType:
 *                   type: string
 *                   description: Unidade de medida do produto
 *                   example: "UN"
 *                 cstCsosn:
 *                   type: string
 *                   description: Código CST/CSOSN do produto
 *                   example: "0102"
 *                 perIcms:
 *                   type: number
 *                   format: float
 *                   description: Percentual do ICMS
 *                   example: 18.0
 *                 category:
 *                   type: object
 *                   description: Dados da categoria associada ao produto
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: ID da categoria
 *                       example: 1
 *                     name:
 *                       type: string
 *                       description: Nome da categoria
 *                       example: "Bebidas"
 *       404:
 *         description: Produto não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Não foi encontrado o produto com o ID: 1."
 */
router.get('/:id', productController.getProductById.bind(productController));

/**
 * @swagger
 * /product:
 *   post:
 *     summary: Cria um novo produto
 *     tags: [Produtos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 description: Descrição do produto
 *                 example: "Produto XYZ"
 *               price:
 *                 type: number
 *                 description: Preço do produto
 *                 example: 150.00
 *               cfop:
 *                 type: string
 *                 description: Código Fiscal de Operações e Prestações
 *                 example: "5405"
 *               ean:
 *                 type: string
 *                 description: Código EAN do produto
 *                 example: "7891234567890"
 *               dtvenc:
 *                 type: string
 *                 format: date
 *                 description: Data de vencimento do produto
 *                 example: "2024-06-15"
 *               unitType:
 *                 type: string
 *                 description: Unidade de medida do produto
 *                 example: "UN"
 *               cstCsosn:
 *                 type: string
 *                 description: Código CST/CSOSN do produto
 *                 example: "102"
 *               cstPis:
 *                 type: string
 *                 description: Código CST do PIS
 *                 example: "01"
 *               cstCofins:
 *                 type: string
 *                 description: Código CST do COFINS
 *                 example: "01"
 *               cstIpi:
 *                 type: string
 *                 description: Código CST do IPI
 *                 example: "50"
 *               perIcms:
 *                 type: number
 *                 format: float
 *                 description: Percentual do ICMS
 *                 example: 18.00
 *               perPis:
 *                 type: number
 *                 format: float
 *                 description: Percentual do PIS
 *                 example: 1.65
 *               perCofins:
 *                 type: number
 *                 format: float
 *                 description: Percentual do COFINS
 *                 example: 7.60
 *               perIpi:
 *                 type: number
 *                 format: float
 *                 description: Percentual do IPI
 *                 example: 5.00
 *               categoryId:
 *                 type: integer
 *                 description: ID da categoria associada
 *                 example: 3
 *     responses:
 *       201:
 *         description: Produto criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID do produto criado
 *                   example: 1
 *                 description:
 *                   type: string
 *                   description: Descrição do produto
 *                   example: "Produto XYZ"
 *                 category:
 *                   type: object
 *                   description: Dados da categoria associada ao produto
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: ID da categoria
 *                       example: 3
 *                     name:
 *                       type: string
 *                       description: Nome da categoria
 *                       example: "Bebidas"
 *       400:
 *         description: Dados inválidos ou produto já existente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensagem de erro
 *                   example: "Erro ao criar produto."
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Lista de erros encontrados
 *                   example: ["Descrição é obrigatória.", "EAN deve ser único."]
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
 *                   example: "Não foi possível inserir um produto novo."
 */
router.post('/', validate(createProduct), checkPermissions(['create']), productController.createProduct.bind(productController));

/**
 * @swagger
 * /product/{id}:
 *   put:
 *     summary: Atualiza um produto existente
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: O ID do produto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 description: Descrição do produto
 *                 example: "Produto XYZ"
 *               price:
 *                 type: number
 *                 description: Preço do produto
 *                 example: 150.50
 *               cfop:
 *                 type: string
 *                 description: Código Fiscal de Operações e Prestações
 *                 example: "5405"
 *               ean:
 *                 type: string
 *                 description: Código EAN do produto
 *                 example: "7891234567890"
 *               dtvenc:
 *                 type: string
 *                 format: date
 *                 description: Data de vencimento do produto
 *                 example: "2024-06-15"
 *               unitType:
 *                 type: string
 *                 description: Unidade de medida do produto
 *                 example: "UN"
 *               cstCsosn:
 *                 type: string
 *                 description: Código CST/CSOSN do produto
 *                 example: "102"
 *               perIcms:
 *                 type: number
 *                 format: float
 *                 description: Percentual do ICMS
 *                 example: 18
 *               perPis:
 *                 type: number
 *                 format: float
 *                 description: Percentual do PIS
 *                 example: 1.65
 *               perCofins:
 *                 type: number
 *                 format: float
 *                 description: Percentual do COFINS
 *                 example: 7.6
 *               perIpi:
 *                 type: number
 *                 format: float
 *                 description: Percentual do IPI
 *                 example: 5
 *               categoryId:
 *                 type: integer
 *                 description: ID da categoria associada
 *                 example: 3
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID do produto
 *                   example: 1
 *                 description:
 *                   type: string
 *                   description: Descrição do produto
 *                   example: "Produto XYZ"
 *                 price:
 *                   type: number
 *                   description: Preço do produto
 *                   example: 150.50
 *                 category:
 *                   type: object
 *                   description: Dados da categoria associada ao produto
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: ID da categoria
 *                       example: 3
 *                     name:
 *                       type: string
 *                       description: Nome da categoria
 *                       example: "Bebidas"
 *       404:
 *         description: Produto não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Produto não encontrado"
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
 *                   example: ["Descrição é obrigatória."]
 */
router.put('/:id', validate(updateProduct), checkPermissions(['update']), productController.updateProduct.bind(productController));

/**
 * @swagger
 * /product/{id}:
 *   delete:
 *     summary: Exclui um produto específico
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: O ID do produto a ser excluído
 *     responses:
 *       200:
 *         description: Produto excluído com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: O produto com o ID 1 foi excluído com sucesso
 *       404:
 *         description: Produto não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: O produto com o ID 1 não foi encontrado
 *       500:
 *         description: Erro interno ao excluir o produto.
 */
router.delete('/:id', checkPermissions(['delete']), productController.deleteProduct.bind(productController));

/**
 * @swagger
 * /product/activate/{id}:
 *   patch:
 *     summary: Ativa um produto
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Produto ativado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Produto ativado com sucesso
 *                 product:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     description:
 *                       type: string
 *                       example: "Produto Ativo"
 *       404:
 *         description: Produto não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: O produto com o ID 1 não foi encontrado
 *       500:
 *         description: Erro interno ao ativar o produto.
 */
router.patch('/activate/:id', checkPermissions(['update']), productController.activateProduct.bind(productController));

/**
 * @swagger
 * /product/deactivate/{id}:
 *   patch:
 *     summary: Desativa um produto
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Produto desativado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Produto desativado com sucesso
 *                 product:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     description:
 *                       type: string
 *                       example: "Produto Inativo"
 *       404:
 *         description: Produto não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: O produto com o ID 1 não foi encontrado
 *       500:
 *         description: Erro interno ao desativar o produto.
 */
router.patch('/deactivate/:id', checkPermissions(['update']), productController.deactivateProduct.bind(productController));

module.exports = router;