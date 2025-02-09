const checkPermissions = require('../middlewares/permissions');
const express = require('express');
const router = express.Router();
const db = require('../config/mysql');
const Endereco = require('../models/Endereco');

/**
 * @swagger
 * tags:
 *   name: Endereços
 *   description: API de gerenciamento de endereços
 */

/**
 * @swagger
 * /endereco:
 *   get:
 *     summary: Retorna todos os endereços
 *     tags: [Endereços]
 *     responses:
 *       200:
 *         description: Lista de todos os endereços.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   codendereco:
 *                     type: integer
 *                     description: ID do endereço
 *                   logradouro:
 *                     type: string
 *                     description: Logradouro do endereço
 *                   numero:
 *                     type: string
 *                     description: Número do endereço
 *                   complemento:
 *                     type: string
 *                     description: Complemento do endereço
 *                   bairro:
 *                     type: string
 *                     description: Bairro do endereço
 *                   municipio:
 *                     type: string
 *                     description: Município (cidade) do endereço
 *                   cep:
 *                     type: string
 *                     description: Código postal (CEP) do endereço
 *                   codpais:
 *                     type: string
 *                     description: Código do país
 *                   pais:
 *                     type: string
 *                     description: Nome do país
 *                   cidade_id:
 *                     type: integer
 *                     description: ID da cidade
 *                   entidade_id:
 *                     type: integer
 *                     description: ID da entidade associada ao endereço (cliente, filial, fornecedor, etc.)
 */
router.get('/', (req, res, next) => {
    let sql = ' SELECT codendereco, logradouro, numero, bairro, municipio, cep, codpais, pais, complemento, cidade_id, entidade_id';
    sql += '    FROM endereco';

    db.getConnection((error, conn) => {
        if (error) {
            return next(error);
        }
        conn.query(sql, (error, results) => {
            conn.release(); // Libera a conexão

            if (error) {
                return next(error);
            }

            const enderecos = results.map(endereco => new Endereco(endereco));
            res.status(200).send(enderecos);
        });
    });
});

/**
 * @swagger
 * /endereco/codendereco/{codendereco}:
 *   get:
 *     summary: Retorna um endereço específico pelo ID
 *     tags: [Endereços]
 *     parameters:
 *       - in: path
 *         name: codendereco
 *         required: true
 *         schema:
 *           type: integer
 *         description: O ID do endereço
 *     responses:
 *       200:
 *         description: Endereço retornado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 codendereco:
 *                   type: integer
 *                   description: ID do endereço
 *                 logradouro:
 *                   type: string
 *                   description: Logradouro do endereço
 *                 numero:
 *                   type: string
 *                   description: Número do endereço
 *                 complemento:
 *                   type: string
 *                   description: Complemento do endereço
 *                 bairro:
 *                   type: string
 *                   description: Bairro do endereço
 *                 municipio:
 *                   type: string
 *                   description: Cidade do endereço
 *                 cep:
 *                   type: string
 *                   description: Código postal (CEP) do endereço
 *                 codpais:
 *                   type: string
 *                   description: Código do país
 *                 pais:
 *                   type: string
 *                   description: Nome do país
 *                 cidade_id:
 *                   type: integer
 *                   description: ID da cidade
 *                 entidade_id:
 *                     type: integer
 *                     description: ID da entidade associada ao endereço (cliente, filial, fornecedor, etc.)
 *       404:
 *         description: Endereço não encontrado.
 */
router.get('/codendereco/:codendereco', (req, res, next) => {
    db.getConnection((error, conn) => {
        if (error) {
            return next(error);
        }

        conn.query('SELECT codendereco, logradouro, numero, bairro, municipio, cep, codpais, pais, complemento, cidade_id, entidade_id FROM endereco WHERE codendereco = ?;', 
            [req.params.codendereco], (error, results) => {
            conn.release();
            if (error) {
                return next(error);
            }

            if (results.length === 0) {
                return res.status(404).send({ message: 'Endereço não encontrado' });
            }

            res.status(200).json(results[0]);
        });
    });
});

/**
 * @swagger
 * /endereco:
 *   post:
 *     summary: Cria um novo endereço
 *     tags: [Endereços]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               logradouro:
 *                 type: string
 *                 description: Logradouro do endereço
 *                 example: Rua das Flores
 *               numero:
 *                 type: string
 *                 description: Número do endereço
 *                 example: 123
 *               complemento:
 *                 type: string
 *                 description: Complemento do endereço
 *                 example: Apto 45
 *               bairro:
 *                 type: string
 *                 description: Bairro do endereço
 *                 example: Centro
 *               municipio:
 *                 type: string
 *                 description: Cidade do endereço
 *                 example: São Paulo
 *               uf:
 *                 type: string
 *                 description: Unidade Federativa (UF) do endereço
 *                 example: SP
 *               cep:
 *                 type: string
 *                 description: Código postal (CEP) do endereço
 *                 example: 01000-000
 *               codpais:
 *                 type: string
 *                 description: Código do país
 *                 example: 1058
 *               pais:
 *                 type: string
 *                 description: Nome do país
 *                 example: Brasil
 *               entidade_id:
 *                 type: integer
 *                 description: ID da entidade associada ao endereço (cliente, filial, fornecedor, etc.)
 *                 example: 1
 *               cidade_id:
 *                 type: integer
 *                 description: ID da cidade
 *                 example: 1001
 *     responses:
 *       201:
 *         description: Endereço inserido com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensagem de sucesso
 *                   example: Endereço inserido com sucesso!
 *                 codendereco:
 *                   type: integer
 *                   description: ID do novo endereço
 *                   example: 123
 *       400:
 *         description: Dados obrigatórios ausentes.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensagem de erro explicando quais campos são obrigatórios
 *                   example: Logradouro, Número, Bairro, Município, CEP, Código do país, País são obrigatórios
 */

router.post('/', checkPermissions(['create']), (req, res, next) => {
    const endereco = new Endereco(req.body);

    db.getConnection((error, conn) => {
        if (error) {
            return next(error);
        }

        conn.query(
            'INSERT INTO endereco (logradouro, numero, bairro, municipio, cep, codpais, pais, complemento, cidade_id, entidade_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
            [
                endereco.logradouro, 
                endereco.numero, 
                endereco.bairro, 
                endereco.municipio, 
                endereco.cep, 
                endereco.codpais, 
                endereco.pais, 
                endereco.complemento,  
                endereco.cidade_id,
                endereco.entidade_id
            ],
            (error, result) => {
                conn.release();
                if (error) {
                    return next(error);
                }

                if (!endereco.logradouro || !endereco.numero || !endereco.bairro || !endereco.municipio || !endereco.cep || !endereco.codpais || !endereco.pais) {
                    return res.status(400).send({ message: 'Logradouro, Número, Bairro, Município, CEP, Código do país, País são obrigatórios' });
                }

                res.status(201).send({
                    message: 'Endereço inserido com sucesso!',
                    codprod: result.insertId,
                });
            }
        );
    });
});


/**
 * @swagger
 * /endereco/codendereco/{codendereco}:
 *   put:
 *     summary: Atualiza um endereço específico pelo ID
 *     tags: [Endereços]
 *     parameters:
 *       - in: path
 *         name: codendereco
 *         required: true
 *         schema:
 *           type: integer
 *         description: O ID do endereço
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               logradouro:
 *                 type: string
 *                 description: Logradouro do endereço
 *                 example: Rua das Flores
 *               numero:
 *                 type: string
 *                 description: Número do endereço
 *                 example: 123
 *               complemento:
 *                 type: string
 *                 description: Complemento do endereço
 *                 example: Apto 45
 *               bairro:
 *                 type: string
 *                 description: Bairro do endereço
 *                 example: Centro
 *               municipio:
 *                 type: string
 *                 description: Cidade do endereço
 *                 example: São Paulo
 *               cep:
 *                 type: string
 *                 description: Código postal (CEP) do endereço
 *                 example: 01000-000
 *               codpais:
 *                 type: string
 *                 description: Código do país
 *                 example: 1058
 *               pais:
 *                 type: string
 *                 description: Nome do país
 *                 example: Brasil
 *               entidade_id:
 *                 type: integer
 *                 description: ID da entidade associada ao endereço (cliente, filial, fornecedor, etc.)
 *                 example: 1
 *               cidade_id:
 *                 type: integer
 *                 description: ID da cidade
 *                 example: 1001
 *     responses:
 *       200:
 *         description: Endereço atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensagem de sucesso
 *                 codendereco:
 *                   type: integer
 *                   description: ID do endereço atualizado
 *       400:
 *         description: Dados obrigatórios ausentes.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensagem de erro explicando quais campos são obrigatórios
 */
router.put('/codendereco/:codendereco', checkPermissions(['update']), (req, res, next) => {
    
    const endereco = new Endereco(req.body);
    endereco.codendereco = req.params.codendereco;

    let sql = ' UPDATE endereco';
    sql += '    SET logradouro = ?, numero = ?, bairro = ?, municipio = ?, cep = ?, codpais = ?, pais = ?, complemento = ?, cidade_id = ?, entidade_id = ?';
    sql += '    WHERE codendereco = ?;'

    db.getConnection((error, conn) => {
        if (error) {
            return next(error);
        }

        conn.query(
            sql,
            [endereco.logradouro, endereco.numero, endereco.complemento, endereco.bairro, endereco.municipio, endereco.cep, endereco.codpais, endereco.pais, endereco.complemento , endereco.codendereco, endereco.cidade_id, endereco.entidade_id ],
            (error, result) => {
                conn.release();
                if (error) {
                    return next(error);
                }

                if (!endereco.logradouro || !endereco.numero ||!endereco.bairro || !endereco.municipio || !endereco.cep || !endereco.codpais || !endereco.pais ) {
                    return res.status(400).send({ message: 'Logradouro, Número, Bairro, Município, UF, CEP, Código do país, País são obrigatórios' });
                }

                res.status(200).send({
                    message: 'Endereço alterado com sucesso!',
                    codprod: endereco.codendereco,
                });
            }
        );
    });
});

/**
 * @swagger
 * /endereco/codendereco/{codendereco}:
 *   delete:
 *     summary: Remove um endereço específico pelo ID
 *     tags: [Endereços]
 *     parameters:
 *       - in: path
 *         name: codendereco
 *         required: true
 *         schema:
 *           type: integer
 *         description: O ID do endereço
 *     responses:
 *       204:
 *         description: Endereço removido com sucesso, sem conteúdo retornado.
 *       404:
 *         description: Endereço não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensagem de erro indicando que o endereço não foi encontrado
 */
router.delete('/codendereco/:codendereco', checkPermissions(['delete']), (req, res, next) => {
    db.getConnection((error, conn) => {
        if (error) {
            return next(error);
        }
        conn.query('SELECT * FROM endereco WHERE codendereco = ?;', [req.params.codendereco], (error, result) => {
            if (error) {
                conn.release();
                return next(error);
            }

            if (result.length === 0) {
                conn.release();
                return res.status(404).send({ message: 'Endereço não encontrado' });
            }

            conn.query('DELETE FROM endereco WHERE codendereco = ?;', [req.params.codendereco], (error) => {
                conn.release();
                if (error) {
                    return next(error);
                }

                res.status(204).send({ message: 'Endereço removido com sucesso!' });
            });
        });
    });
});

module.exports = router;
