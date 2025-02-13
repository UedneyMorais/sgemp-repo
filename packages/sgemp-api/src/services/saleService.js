const { sequelize } = require('shared/src/models');
const saleRepository = require('shared/src/repositories/saleRepository');
const Product = require('shared/src/models/Product');
const SaleItem = require('shared/src/models/SaleItem');
const stockService = require('shared/src/services/stockMovementService');
const Payment = require('shared/src/models/Payment');
const { Op } = require('sequelize');

class SaleService {
  
  // Função para verificar se a venda já foi processada (usando saleId ou pdvSaleId)
  async checkIfSaleProcessed(saleId) {
    console.log(`Verificando se a venda com ID ${saleId} já foi processada...`);
    
    // Verifica se já existe uma venda com o saleId
    const sale = await saleRepository.findByPk(saleId);
    return sale !== null; // Se encontrar, significa que a venda já foi processada
  }

  async createSale(req) {
    const { customerId, items, payments, pdvSaleId } = req.body;  // Usando saleId aqui

    console.log('Iniciando criação da venda:', { customerId, items, payments, pdvSaleId });

    if (isNaN(customerId) || !Number.isInteger(Number(customerId))) {
        console.error(`Erro: customerId inválido: ${customerId}`);
        throw new Error(`customerId inválido: ${customerId}`);
    }

    const itemsArray = JSON.parse(JSON.stringify(items));
    const paymentsArray = JSON.parse(JSON.stringify(payments));

    if (!customerId || !Array.isArray(itemsArray) || itemsArray.length === 0) {
        console.error('Erro: JSON da venda incompleto ou itens incorretos.', req.body);
        throw new Error('O JSON da venda está incompleto ou os itens estão incorretos.');
    }

    const transaction = await sequelize.transaction();

    try {
        // Verifica se a venda já foi processada
        if (await this.checkIfSaleProcessed(pdvSaleId)) {
            console.log(`Venda com saleId ${pdvSaleId} já foi processada. Ignorando.`);
            return;  // Se já foi processada, não faz nada
        }

        console.log(`Criando a venda para o cliente ${customerId} com saleId ${pdvSaleId}`);
        
        const sale = await saleRepository.createSale({
            customerId: Number(customerId),
            pdvSaleId: pdvSaleId,  // Usando saleId diretamente aqui
            transaction: transaction
        });

        console.log(`Venda criada com sucesso. Sale ID: ${sale.id}`);
        const productIds = itemsArray.map(item => item.productId);
        const products = await Product.findAll({
            where: { id: productIds },
            attributes: ['id', 'price'],
            transaction
        });
  
        const productPriceMap = {};
        products.forEach(product => {
            productPriceMap[product.id] = product.price;
        });
  
        let saleItemsData = itemsArray.map(item => ({
            saleId: sale.id,
            productId: item.productId,
            quantity: item.quantity,
            price: parseFloat(productPriceMap[item.productId]),
            value: parseFloat((item.quantity * productPriceMap[item.productId]).toFixed(2))
        }));
  
        console.log('Verificando estoque antes de registrar a venda...');
        for (const item of saleItemsData) {
            const currentStock = await stockService.getStockByProductId(item.productId);
           
            if (currentStock < item.quantity) {
                throw new Error(`Estoque insuficiente para saída do produto ${item.productId}.`);
            }
        }
  
        // Processo de criação e atualização dos itens de venda...
        await SaleItem.bulkCreate(saleItemsData, { transaction });

        for (const item of saleItemsData) {
          await stockService.registerStocksEntry({
              productId: item.productId,
              quantity: item.quantity,
              type: "EXIT",
              saleId: sale.id,
              reason: "Venda realizada"
          }, transaction);
      }

      const totalValue = parseFloat(
          saleItemsData.reduce((sum, item) => sum + parseFloat(item.value), 0)
      ).toFixed(2);

      await saleRepository.updateSaleValue(sale.id, totalValue, transaction);

      const paymentData = paymentsArray.map((payment) => ({
        saleId: sale.id,
        amount: payment.amount,
        paymentMethod: payment.paymentMethodId,
        details: payment.details,
        active: true
      }));

      await Payment.bulkCreate(paymentData, { transaction });

      await transaction.commit(); 
      console.log(`Venda processada e registrada com sucesso (ID: ${sale.id}). Enviando para RabbitMQ...`);


        return { saleId: sale.id, customerId: sale.customerId, totalValue: totalValue };
    } catch (error) {
        console.error('Erro na criação da venda:', error);
        await transaction.rollback();
        throw error;
    }
  }
}

module.exports = new SaleService();
