const checkPermissions = require("../middlewares/permissions");
const express = require("express");
const router = express.Router();
const db = require("../config/mysql");
const Filial = require("../models/Filial");
const Endereco = require("../models/Endereco");
const Telefone = require("../models/Telefone");

/**
 * @swagger
 * tags:
 *   name: Clientes
 *   description: API de gerenciamento de clientes
 */

/**
 * @swagger
 * /cliente:
 *   get:
 *     summary: Retorna todos os clientes, incluindo endereços e telefones
 *     tags: [Clientes]
 *     responses:
 *       200:
 *         description: Lista de todos os clientes, com seus endereços e telefones.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   codcli:
 *                     type: integer
 *                     description: Código do cliente
 *                   nome:
 *                     type: string
 *                     description: Nome do cliente
 *                   cpfcnpj:
 *                     type: string
 *                     description: CPF ou CNPJ do cliente
 *                   email:
 *                     type: string
 *                     description: E-mail do cliente
 *                   ie_rg:
 *                     type: string
 *                     description: Inscrição estadual ou RG do cliente
 *                   contribuinte:
 *                     type: boolean
 *                     description: Indica se o cliente é contribuinte
 *                   enderecos:
 *                     type: array
 *                     description: Lista de endereços do cliente
 *                     items:
 *                       type: object
 *                       properties:
 *                         codendereco:
 *                           type: integer
 *                           description: Código do endereço
 *                         logradouro:
 *                           type: string
 *                           description: Logradouro do endereço
 *                         numero:
 *                           type: string
 *                           description: Número do endereço
 *                         complemento:
 *                           type: string
 *                           description: Complemento do endereço
 *                         bairro:
 *                           type: string
 *                           description: Bairro do endereço
 *                         municipio:
 *                           type: string
 *                           description: Município (cidade) do endereço
 *                         cep:
 *                           type: string
 *                           description: Código postal (CEP) do endereço
 *                         codpais:
 *                           type: string
 *                           description: Código do país
 *                         pais:
 *                           type: string
 *                           description: Nome do país
 *                         cidade_id:
 *                           type: integer
 *                           description: ID da cidade associada ao endereço
 *                         entidade_id:
 *                           type: integer
 *                           description: ID da entidade associada ao endereço (cliente, filial, fornecedor, etc.)
 *                   telefones:
 *                     type: array
 *                     description: Lista de telefones do cliente
 *                     items:
 *                       type: object
 *                       properties:
 *                         codtel:
 *                           type: integer
 *                           description: Código do telefone
 *                         numtel:
 *                           type: string
 *                           description: Número de telefone
 */
router.get("/", (req, res, next) => {
  let sql = `
      SELECT codfilial, razaosocial, nomefantasia, ultnumnota, nserie, seqevento, cpf_cnpj, ie_rg, certificado, senhacert, ambiente
      FROM sgemp.filial
      inner join endereco on filial.codfilial = endereco.entidade_id
      inner join telefone on filial.codfilial = telefone.entidade_id;
    `;

  db.getConnection((error, conn) => {
    if (error) {
      return next(error);
    }

    conn.query(sql, (error, results) => {
      conn.release(); // Libera a conexão

      if (error) {
        return next(error);
      }

      // Organizar dados em um mapa para agrupar endereços e telefones por cliente
      const filiaisMap = new Map();

      results.forEach((row) => { 
        // Verifica se a filial já foi adicionado ao mapa
        if (!filiaisMap.has(row.codcli)) {
          const filial = new Filial({
            razaosocial : row.razaosocial,
            codfilial : row.codfilial,
            nomefantasia : row.nomefantasia,
            ultnumnota :row.ultnumnota,
            nserie : row.nserie,
            seqevento : row.seqevento,
            cpf_cnpj : row.cpf_cnpj, 
            ie_rg : row.ie_rg,
            certificado : row.certificado,
            senhacert : row.senhacert,
            ambiente : row.ambiente,
            enderecos : row.enderecos,
            telefones : row.telefones
          });
          filiaisMap.set(row.codcli, filial);
        }

        // Crie e adicione o Endereco ao cliente
        const endereco = new Endereco({
          codendereco: row.codendereco,
          logradouro: row.logradouro,
          numero: row.numero,
          complemento: row.complemento,
          bairro: row.bairro,
          municipio: row.municipio,
          cep: row.cep,
          codpais: row.codpais,
          pais: row.pais,
          cidade_id: row.cidade_id,
          entidade_id: row.entidade_id
        });
        filiaisMap.get(row.codcli).addEndereco(endereco);

        // Adiciona o telefone ao cliente
        const telefone = {
          codtel: row.codtel,
          numtel: row.numtel
        };
        filiaisMap.get(row.codcli).addTelefone(telefone);
      });

      // Convertendo o Map em uma lista de clientes para envio
      const filiais = Array.from(filiaisMap.values());
      res.status(200).send(filiais);
    });
  });
});


/**
 * @swagger
 * /cliente/codcli/{codcli}:
 *   get:
 *     summary: Retorna um cliente específico pelo código, incluindo endereços e telefones
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: codcli
 *         required: true
 *         schema:
 *           type: integer
 *         description: Código do cliente
 *     responses:
 *       200:
 *         description: Detalhes do cliente, incluindo endereços e telefones.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 codcli:
 *                   type: integer
 *                   description: Código do cliente
 *                 nome:
 *                   type: string
 *                   description: Nome do cliente
 *                 cpfcnpj:
 *                   type: string
 *                   description: CPF ou CNPJ do cliente
 *                 email:
 *                   type: string
 *                   description: E-mail do cliente
 *                 ie_rg:
 *                   type: string
 *                   description: Inscrição estadual ou RG
 *                 contribuinte:
 *                   type: boolean
 *                   description: Indica se o cliente é contribuinte
 *                 enderecos:
 *                   type: array
 *                   description: Lista de endereços do cliente
 *                   items:
 *                     type: object
 *                     properties:
 *                       codendereco:
 *                         type: integer
 *                         description: Código do endereço
 *                       logradouro:
 *                         type: string
 *                         description: Logradouro do endereço
 *                       numero:
 *                         type: string
 *                         description: Número do endereço
 *                       complemento:
 *                         type: string
 *                         description: Complemento do endereço
 *                       bairro:
 *                         type: string
 *                         description: Bairro do endereço
 *                       municipio:
 *                         type: string
 *                         description: Município (cidade) do endereço
 *                       cep:
 *                         type: string
 *                         description: Código postal (CEP) do endereço
 *                       codpais:
 *                         type: string
 *                         description: Código do país
 *                       pais:
 *                         type: string
 *                         description: Nome do país
 *                       cidade_id:
 *                         type: integer
 *                         description: ID da cidade
 *                       entidade_id:
 *                         type: integer
 *                         description: ID da entidade associada ao endereço
 *                 telefones:
 *                   type: array
 *                   description: Lista de telefones do cliente
 *                   items:
 *                     type: object
 *                     properties:
 *                       codtel:
 *                         type: integer
 *                         description: Código do telefone
 *                       numtel:
 *                         type: string
 *                         description: Número de telefone
 *       404:
 *         description: Cliente não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensagem de erro indicando que o cliente não foi encontrado
 */
router.get("/codcli/:codcli", (req, res, next) => {

    const codcli = req.params.codcli;

    let sql = `
              SELECT cliente.codcli, cliente.nome,cliente.cpfcnpj, cliente.email, cliente.ie_rg, cliente.contribuinte,
              endereco.codendereco , endereco.logradouro, endereco.numero, endereco.complemento, 
              endereco.bairro, endereco.municipio, endereco.cep, endereco.codpais, endereco.pais, endereco.cidade_id, endereco.entidade_id,
              telefone.codtel, telefone.numtel
              FROM sgemp.cliente
              inner join endereco on cliente.codcli = endereco.entidade_id
              inner join telefone on cliente.codcli = telefone.codcli
              WHERE cliente.codcli = ?;
              `;
  
    db.getConnection((error, conn) => {

      if (error) {
        return next(error);
      }
  
      conn.query(sql, [codcli] , (error, results) => {
        conn.release(); // Libera a conexão
  
            if (error) {
                return next(error);
            }

            if (results.length === 0) {
                return res.status(404).send({ message: "Cliente não encontrado" });
            } 

        // Organizar dados em um mapa para agrupar endereços por cliente
        const clientesMap = new Map();
  
        results.forEach((row) => {
        // Se o cliente já foi adicionado ao mapa, apenas adicione o endereço e telefone
          if (!clientesMap.has(row.codcli)) {
            const cliente = new Cliente({
                codcli: row.codcli,
                nome: row.nome,
                cpfcnpj: row.cpfcnpj,
                email: row.email,
                ie_rg: row.ie_rg,
                contribuinte: row.contribuinte
              });
          clientesMap.set(row.codcli, cliente);
        }
  
          // Crie o objeto Endereco e adicione ao cliente
        const endereco = new Endereco({
            codendereco: row.codendereco,
            logradouro: row.logradouro,
            numero: row.numero,
            complemento: row.complemento,
            bairro: row.bairro,
            municipio: row.municipio,
            cep: row.cep,
            codpais: row.codpais,
            pais: row.pais,
            cidade_id: row.cidade_id,
            entidade_id: row.entidade_id
          });
  
          clientesMap.get(row.codcli).addEndereco(endereco);
  
          // Cria e adiciona o telefone ao cliente
          const telefone = {
            codtel: row.codtel,
            numtel: row.numtel
          };
  
          clientesMap.get(row.codcli).addTelefone(telefone);
        });
  
        // Convertendo o Map em uma lista de clientes
        const clientes = Array.from(clientesMap.values());
        res.status(200).send(clientes);
      });
    });
  });

/**
 * @swagger
 * /cliente/cpfcnpj/{cpfcnpj}:
 *   get:
 *     summary: Retorna um cliente específico pelo CPF ou CNPJ, incluindo endereços e telefones
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: cpfcnpj
 *         required: true
 *         schema:
 *           type: string
 *         description: CPF ou CNPJ do cliente
 *     responses:
 *       200:
 *         description: Detalhes do cliente, incluindo endereços e telefones.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 codcli:
 *                   type: integer
 *                   description: Código do cliente
 *                 nome:
 *                   type: string
 *                   description: Nome do cliente
 *                 cpfcnpj:
 *                   type: string
 *                   description: CPF ou CNPJ do cliente
 *                 email:
 *                   type: string
 *                   description: E-mail do cliente
 *                 ie_rg:
 *                   type: string
 *                   description: Inscrição estadual ou RG
 *                 contribuinte:
 *                   type: boolean
 *                   description: Indica se o cliente é contribuinte
 *                 enderecos:
 *                   type: array
 *                   description: Lista de endereços do cliente
 *                   items:
 *                     type: object
 *                     properties:
 *                       codendereco:
 *                         type: integer
 *                         description: Código do endereço
 *                       logradouro:
 *                         type: string
 *                         description: Logradouro do endereço
 *                       numero:
 *                         type: string
 *                         description: Número do endereço
 *                       complemento:
 *                         type: string
 *                         description: Complemento do endereço
 *                       bairro:
 *                         type: string
 *                         description: Bairro do endereço
 *                       municipio:
 *                         type: string
 *                         description: Município (cidade) do endereço
 *                       cep:
 *                         type: string
 *                         description: Código postal (CEP) do endereço
 *                       codpais:
 *                         type: string
 *                         description: Código do país
 *                       pais:
 *                         type: string
 *                         description: Nome do país
 *                       cidade_id:
 *                         type: integer
 *                         description: ID da cidade
 *                       entidade_id:
 *                         type: integer
 *                         description: ID da entidade associada ao endereço (cliente, filial, fornecedor, etc.)
 *                 telefones:
 *                   type: array
 *                   description: Lista de telefones do cliente
 *                   items:
 *                     type: object
 *                     properties:
 *                       codtel:
 *                         type: integer
 *                         description: Código do telefone
 *                       numtel:
 *                         type: string
 *                         description: Número de telefone
 *       404:
 *         description: Cliente não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensagem de erro indicando que o cliente não foi encontrado
 */
router.get("/cpfcnpj/:cpfcnpj", (req, res, next) => {

    const cpfcnpj = req.params.cpfcnpj;
    console.log("Valor de cpfcnpj:", cpfcnpj);
    let sql = `
              SELECT cliente.codcli, cliente.nome,cliente.cpfcnpj, cliente.email, cliente.ie_rg, cliente.contribuinte,
              endereco.codendereco , endereco.logradouro, endereco.numero, endereco.complemento, 
              endereco.bairro, endereco.municipio, endereco.cep, endereco.codpais, endereco.pais, endereco.cidade_id, endereco.entidade_id, 
              telefone.codtel, telefone.numtel
              FROM sgemp.cliente
              inner join endereco on cliente.codcli = endereco.entidade_id
              inner join telefone on cliente.codcli = telefone.codcli
              WHERE cliente.cpfcnpj = ?;
              `;
  
    db.getConnection((error, conn) => {

      if (error) {
        return next(error);
      }
  
      conn.query(sql, [cpfcnpj] , (error, results) => {
        conn.release(); // Libera a conexão
  
            if (error) {
                return next(error);
            }

            if (results.length === 0) {
                return res.status(404).send({ message: "Cliente não encontrado" });
            } 

        // Organizar dados em um mapa para agrupar endereços por cliente
        const clientesMap = new Map();
  
        results.forEach((row) => {
        // Se o cliente já foi adicionado ao mapa, apenas adicione o endereço e telefone
          if (!clientesMap.has(row.codcli)) {
            const cliente = new Cliente({
                codcli: row.codcli,
                nome: row.nome,
                cpfcnpj: row.cpfcnpj,
                email: row.email,
                ie_rg: row.ie_rg,
                contribuinte: row.contribuinte
              });
          clientesMap.set(row.codcli, cliente);
        }
  
          // Crie o objeto Endereco e adicione ao cliente
        const endereco = new Endereco({
          codendereco: row.codendereco,
          logradouro: row.logradouro,
          numero: row.numero,
          complemento: row.complemento,
          bairro: row.bairro,
          municipio: row.municipio,
          cep: row.cep,
          codpais: row.codpais,
          pais: row.pais,
          cidade_id: row.cidade_id,
          entidade_id: row.entidade_id
          });
  
          clientesMap.get(row.codcli).addEndereco(endereco);
  
          // Cria e adiciona o telefone ao cliente
          const telefone = {
            codtel: row.codtel,
            numtel: row.numtel
          };
  
          clientesMap.get(row.codcli).addTelefone(telefone);
        });
  
        // Convertendo o Map em uma lista de clientes
        const clientes = Array.from(clientesMap.values());
        res.status(200).send(clientes);
      });
    });
  });

/**
 * @swagger
 * /cliente:
 *   post:
 *     summary: Cria um novo cliente, incluindo telefones e endereços
 *     tags: [Clientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome do cliente
 *                 example: "João Silva"
 *               cpfcnpj:
 *                 type: string
 *                 description: CPF ou CNPJ do cliente
 *                 example: "123.456.789-00"
 *               email:
 *                 type: string
 *                 description: Email do cliente
 *                 example: "joao.silva@example.com"
 *               ie_rg:
 *                 type: string
 *                 description: Inscrição estadual ou RG do cliente
 *                 example: "123456789"
 *               contribuinte:
 *                 type: boolean
 *                 description: Indica se o cliente é contribuinte
 *                 example: true
 *               telefones:
 *                 type: array
 *                 description: Lista de telefones do cliente
 *                 items:
 *                   type: object
 *                   properties:
 *                     numtel:
 *                       type: string
 *                       description: Número de telefone
 *                       example: "62988888888"
 *               enderecos:
 *                 type: array
 *                 description: Lista de endereços do cliente
 *                 items:
 *                   type: object
 *                   properties:
 *                     logradouro:
 *                       type: string
 *                       description: Logradouro do endereço
 *                       example: "Rua das Flores"
 *                     numero:
 *                       type: string
 *                       description: Número do endereço
 *                       example: "123"
 *                     complemento:
 *                       type: string
 *                       description: Complemento do endereço
 *                       example: "Apto 101"
 *                     bairro:
 *                       type: string
 *                       description: Bairro do endereço
 *                       example: "Centro"
 *                     municipio:
 *                       type: string
 *                       description: Município (cidade) do endereço
 *                       example: "São Paulo"
 *                     cep:
 *                       type: string
 *                       description: Código postal (CEP) do endereço
 *                       example: "01000-000"
 *                     codpais:
 *                       type: string
 *                       description: Código do país
 *                       example: "1058"
 *                     pais:
 *                       type: string
 *                       description: Nome do país
 *                       example: "Brasil"
 *                     cidade_id:
 *                       type: integer
 *                       description: ID da cidade associada ao endereço
 *                       example: 1001
 *     responses:
 *       201:
 *         description: Cliente, telefones e endereços inseridos com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensagem de sucesso
 *                 codcli:
 *                   type: integer
 *                   description: Código do cliente criado
 *                   example: 1
 *       400:
 *         description: Falha na validação dos dados.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensagem de erro explicando o problema
 */
router.post("/", checkPermissions(["create"]), (req, res, next) => {
  const cliente = new Cliente(req.body);   

  if (!cliente.nome) {
    return res.status(400).send({ message: "O campo 'nome' é obrigatório" });
  }

  const sqlCliente = `
    INSERT INTO cliente (nome, cpfcnpj, email, ie_rg, contribuinte)
    VALUES (?, ?, ?, ?, ?);
  `;

  db.getConnection((error, conn) => {
    if (error) {
      return next(error);
    }

    // Inserindo o cliente
    conn.query(sqlCliente, [cliente.nome, cliente.cpfcnpj, cliente.email, cliente.ie_rg, cliente.contribuinte ], (error, result) => {
      if (error) {
        conn.release();
        return next(error);
      }

      const codcli = result.insertId;

      // Função auxiliar para inserir telefones
      const inserirTelefones = () => {
        return new Promise((resolve, reject) => {
          const telefones = cliente.telefones || [];
          if (telefones.length === 0) return resolve();

          const sqlTelefone = `
            INSERT INTO telefone (numtel, codcli)
            VALUES (?, ?);
          `;

          let contador = 0;
          telefones.forEach(telefone => {
            conn.query(sqlTelefone, [telefone.numtel, codcli], (error) => {
              if (error) return reject(error);
              if (++contador === telefones.length) resolve(); // Resolve após todos os telefones serem inseridos
            });
          });
        });
      };

      // Função auxiliar para inserir endereços
      const inserirEnderecos = () => {
        return new Promise((resolve, reject) => {
          const enderecos = cliente.enderecos || [];
          if (enderecos.length === 0) return resolve();

          const sqlEndereco = `
            INSERT INTO endereco (logradouro, numero, complemento, bairro, municipio, cep, codpais, pais, cidade_id, entidade_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
          `;

          let contador = 0;
          enderecos.forEach(endereco => {
            conn.query(sqlEndereco, [
              endereco.logradouro,
              endereco.numero,
              endereco.complemento,
              endereco.bairro,
              endereco.municipio,
              endereco.cep,
              endereco.codpais,
              endereco.pais,
              endereco.cidade_id,
              codcli,
            ], (error) => {
              if (error) return reject(error);
              if (++contador === enderecos.length) resolve(); // Resolve após todos os endereços serem inseridos
            });
          });
        });
      };

      // Executa as inserções de telefone e endereço
      inserirTelefones()
        .then(inserirEnderecos)
        .then(() => {
          conn.release();
          res.status(201).send({
            message: "Cliente, telefones e endereços inseridos com sucesso!",
            codcli: codcli
          });
        })
        .catch(error => {
          conn.release();
          next(error);
        });
    });
  });
});


/**
 * @swagger
 * /cliente/codcli/{codcli}:
 *   put:
 *     summary: Atualiza um cliente existente
 *     description: Atualiza as informações de um cliente, incluindo nome, CPF/CNPJ, email, inscrição estadual ou RG, status de contribuinte, telefones e endereços.
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: codcli
 *         required: true
 *         schema:
 *           type: integer
 *         description: Código do cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome do cliente
 *                 example: "João Silva"
 *               cpfcnpj:
 *                 type: string
 *                 description: CPF ou CNPJ do cliente
 *                 example: "123.456.789-00"
 *               email:
 *                 type: string
 *                 description: Email do cliente
 *                 example: "joao.silva@example.com"
 *               ie_rg:
 *                 type: string
 *                 description: Inscrição estadual ou RG do cliente
 *                 example: "123456789"
 *               contribuinte:
 *                 type: boolean
 *                 description: Indica se o cliente é contribuinte
 *                 example: true
 *               telefones:
 *                 type: array
 *                 description: Lista de telefones do cliente
 *                 items:
 *                   type: object
 *                   properties:
 *                     codtel:
 *                       type: integer
 *                       description: Código do telefone
 *                       example: 1
 *                     numtel:
 *                       type: string
 *                       description: Número do telefone
 *                       example: "62988888888"
 *               enderecos:
 *                 type: array
 *                 description: Lista de endereços do cliente
 *                 items:
 *                   type: object
 *                   properties:
 *                     codendereco:
 *                       type: integer
 *                       description: Código do endereço
 *                       example: 101
 *                     logradouro:
 *                       type: string
 *                       description: Logradouro do endereço
 *                       example: "Rua das Flores"
 *                     numero:
 *                       type: string
 *                       description: Número do endereço
 *                       example: "123"
 *                     complemento:
 *                       type: string
 *                       description: Complemento do endereço
 *                       example: "Apto 101"
 *                     bairro:
 *                       type: string
 *                       description: Bairro do endereço
 *                       example: "Centro"
 *                     municipio:
 *                       type: string
 *                       description: Município (cidade) do endereço
 *                       example: "São Paulo"
 *                     cep:
 *                       type: string
 *                       description: Código postal (CEP) do endereço
 *                       example: "01000-000"
 *                     codpais:
 *                       type: string
 *                       description: Código do país
 *                       example: "1058"
 *                     pais:
 *                       type: string
 *                       description: Nome do país
 *                       example: "Brasil"
 *                     cidade_id:
 *                       type: integer
 *                       description: ID da cidade associada ao endereço
 *                       example: 1001
 *     responses:
 *       200:
 *         description: Cliente atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cliente, telefones e endereços atualizados com sucesso!
 *                 codcli:
 *                   type: integer
 *                   description: Código do cliente atualizado
 *                   example: 1
 *       400:
 *         description: Erro na requisição - campo obrigatório faltando ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: O campo 'nome' é obrigatório
 *       404:
 *         description: Cliente não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cliente não encontrado
 *       500:
 *         description: Erro no servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Ocorreu um erro no servidor
 */
router.put("/codcli/:codcli", checkPermissions(["update"]), (req, res, next) => {  
  const cliente = new Cliente(req.body); 
  cliente.codcli = req.params.codcli;

  if (!cliente.nome) {
    return res.status(400).send({ message: "O campo 'nome' é obrigatório" });
  }

  db.getConnection((error, conn) => {

    if (error) {
      return next(error);
    }

    const sqlBuscaCliente = `
        SELECT cpfcnpj FROM cliente
        WHERE codcli = ?;
      `;

    conn.query(sqlBuscaCliente, [req.params.codcli], (error, result) => {

      if (error) {
        conn.release();
        return next(error);
      }

      if (result.length === 0) {
        conn.release();
        return res.status(404).send({ message: "Cliente não encontrado" });
      }

      const sqlAtualizarCliente = `
        UPDATE cliente
        SET nome = ?, cpfcnpj = ?, email = ?, ie_rg= ?, contribuinte= ?
        WHERE codcli = ?;
      `;

    // Atualiza o cliente
    conn.query(sqlAtualizarCliente, [cliente.nome, cliente.cpfcnpj, cliente.email, cliente.ie_rg, cliente.contribuinte, cliente.codcli], (error) => {
      if (error) {
        conn.release();
        return next(error);
      }

      // Atualiza Telefones
      const atualizarTelefones = () => {
        return new Promise((resolve, reject) => {
        const telefones = cliente.telefones || [];
        if (telefones.length === 0) return resolve();

        let contador = 0;
        telefones.forEach(telefone => {
        const sqlTelefone = `
          UPDATE telefone
          SET numtel = ?
          WHERE codcli = ? AND codtel = ?;
        `;
        conn.query(sqlTelefone, [telefone.numtel, cliente.codcli, telefone.codtel], (error, result) => {
          if (error) return reject(error);
            console.log(`Telefone atualizado: ${telefone.numtel}, Cliente: ${cliente.codcli}, Telefone ID: ${telefone.codtel}, Afectadas: ${result.affectedRows}`);
          if (++contador === telefones.length) resolve();
        });
        });
      });
      };

      // Função auxiliar para atualizar endereços
      const atualizarEnderecos = () => {
        return new Promise((resolve, reject) => {
          const enderecos = cliente.enderecos || [];
          if (enderecos.length === 0) return resolve();

          let contador = 0;
          enderecos.forEach(endereco => {
            const sqlEndereco = `
              UPDATE endereco
              SET logradouro = ?, numero = ?, complemento = ?, bairro = ?, municipio = ?, cep = ?, codpais = ?, pais = ?, cidade_id = ? 
              WHERE entidade_id = ? AND codendereco = ?;
            `;
            conn.query(sqlEndereco, 
              [
              endereco.logradouro, 
              endereco.numero, 
              endereco.complemento, 
              endereco.bairro,
              endereco.municipio,
              endereco.cep, 
              endereco.codpais, 
              endereco.pais, 
              endereco.cidade_id, 
              cliente.codcli, 
              endereco.codendereco
              ], (error) => {
              if (error) return reject(error);
              if (++contador === enderecos.length) resolve();
            });
          });
        });
      };

      // Executa as atualizações de telefone e endereço
      atualizarTelefones()
        .then(atualizarEnderecos)
        .then(() => {
          conn.release();
          res.status(200).send({
            message: "Cliente, telefones e endereços atualizados com sucesso!",
            codcli: cliente.codcli,
          });
        })
        .catch(error => {
          conn.release();
          next(error);
        });
    });
    });
  });
});



/**
 * @swagger
 * /cliente/codcli/{codcli}:
 *   delete:
 *     summary: Remove um cliente específico pelo código do cliente
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: codcli
 *         required: true
 *         schema:
 *           type: integer
 *         description: O código do cliente
 *     responses:
 *       204:
 *         description: Cliente removido com sucesso, sem conteúdo retornado.
 *       404:
 *         description: Cliente não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensagem de erro indicando que o cliente não foi encontrado
 *                   example: Cliente não encontrado
 *       500:
 *         description: Erro interno no servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensagem de erro indicando uma falha no servidor
 *                   example: Ocorreu um erro no servidor
 */
router.delete("/codcli/:codcli", checkPermissions(["delete"]), (req, res, next) => {
  const codcli = req.params.codcli;

  db.getConnection((error, conn) => {
    if (error) {
      return next(error);
    }

    // Inicia a transação
    conn.beginTransaction((error) => {
      if (error) {
        conn.release();
        return next(error);
      }

      // Verifica se o cliente existe
      conn.query("SELECT * FROM cliente WHERE codcli = ?;", [codcli], (error, result) => {
        if (error) {
          conn.rollback(() => conn.release());
          return next(error);
        }

        if (result.length === 0) {
          conn.rollback(() => conn.release());
          return res.status(404).send({ message: "Cliente não encontrado" });
        }

        // Remove telefones do cliente
        conn.query("DELETE FROM telefone WHERE codcli = ?;", [codcli], (error) => {
          if (error) {
            conn.rollback(() => conn.release());
            return next(error);
          }

          // Remove endereços do cliente
          conn.query("DELETE FROM endereco WHERE entidade_id = ?;", [codcli], (error) => {
            if (error) {
              conn.rollback(() => conn.release());
              return next(error);
            }

            // Remove o cliente
            conn.query("DELETE FROM cliente WHERE codcli = ?;", [codcli], (error) => {
              if (error) {
                conn.rollback(() => conn.release());
                return next(error);
              }

              // Confirma a transação
              conn.commit((error) => {
                conn.release();
                if (error) {
                  conn.rollback(() => conn.release());
                  return next(error);
                }

                res.status(204).send({ message: "Cliente removido com sucesso!" });
              });
            });
          });
        });
      });
    });
  });
});


module.exports = router;
