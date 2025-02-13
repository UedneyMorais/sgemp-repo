const { sequelize } = require('shared/src/models');
const saleRepository = require('shared/src/repositories/saleRepository');
const Product = require('shared/src/models/Product');
const SaleItem = require('shared/src/models/SaleItem');
const stockService = require('shared/src/services/stockMovementService');
const Payment = require('shared/src/models/Payment');
const { Op } = require('sequelize');
//const { sendToQueue } = require('../config/rabbitmq');


class SaleService {

//   async getSales({ page, perPage, id }) {
//     const offset = (page - 1) * perPage;

//     const where = {};
//     if (id) where.id = id;

//     const { rows: sales, count } = await saleRepository.findAndCountAll({
//         where,
//         limit: perPage,
//         offset,
//     });


//     const formattedSales = sales.map(sale => ({
//         saleId: sale.saleId,
//         customerId: sale.customerId,
//         value: sale.value ?? 0, 
//         items: sale.items.map(item => ({
//             productId: item.productId,
//             quantity: item.quantity ?? 0,
//             price: item.price ?? 0,
//             value: item.value ?? 0
//         }))
//     }));

//     return {
//         total: count,
//         perPage,
//         currentPage: page,
//         lastPage: Math.ceil(count / perPage),
//         data: formattedSales
//     };
//   }

//   async getAllSales({ id, all }) {
//     const where = {};

//     if (!all) {
//         if (id) where.id = id;
//     }

//     const sales = await saleRepository.findAll({ where });
    

//     const formattedSales = sales.map(sale => ({
//             saleId: sale.saleId,
//             customerId: sale.customerId,
//             total: sale.total ?? 0,
//             items: sale.items.map(item => ({
//                 productId: item.productId,
//                 quantity: item.quantity ?? 0,
//                 price: item.price ?? 0,
//                 value: item.value ?? 0
//             })),
        
//             paymentsMethods: sale.payments.map((payment) => ({
//                 amount: payment.amount ?? 0,
//                 paymentMethod: payment.paymentMethod ?? '',
//                 details: payment.details ?? ''
//             })),
        
//         }));

//         return { data: formattedSales, total: sales.length };
//     }

//   async getSaleById(id) {

//     const numericSaleId = Number(id);

//     const sale = await saleRepository.findByPk(numericSaleId);

//     if (!sale) {
//         throw new Error(`Venda com ID ${id} não encontrada.`);
//     }
    
//     const saleItemsData = Array.isArray(sale.items) ? sale.items : [];

//     const totalValue = saleItemsData.reduce((sum, item) => sum + (item.value || 0), 0);

//     const paymentsData = Array.isArray(sale.payments) ? sale.payments : [];

//     const paymentsArray = JSON.parse(JSON.stringify(paymentsData));


//     const formattedSales = this.formattedSales({ sale, totalValue, paymentsArray, saleItemsData});

//     return  formattedSales;
// }

async createSale(req) {
  const { customerId, items, payments, pdvSaleId} = req.body;

  const itemsArray = JSON.parse(JSON.stringify(items));

  const paymentsArray = JSON.parse(JSON.stringify(payments));

  if (!customerId || !Array.isArray(itemsArray) || itemsArray.length === 0) {
    console.error('Erro: JSON da venda incompleto ou itens incorretos.', req.body);
    throw new Error('O JSON da venda está incompleto ou os itens estão incorretos.');
  }

  const transaction = await sequelize.transaction(); 

  try {
      const sale = await saleRepository.createSale(customerId,{transaction});
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

      for (const item of saleItemsData) {
          const currentStock = await stockService.getStockByProductId(item.productId);
         
          if (currentStock < item.quantity) {
            console.error(`Erro: Estoque insuficiente para o produto ${item.productId}`);
            throw new Error(`Estoque insuficiente para saída do produto ${item.productId}.`);
          }
      }

      //Agora que sabemos que tem estoque suficiente, registramos a saída
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

      const formattedSales = this.formattedSales({ sale, totalValue, paymentsArray, saleItemsData});
      return  formattedSales;
  } catch (error) {
      await transaction.rollback(); 
      throw error;
  }
}


async formattedSales({ sale, totalValue, paymentsArray, saleItemsData  }){
    const formattedSales = {
        saleId: sale.id,
        customerId: sale.customerId,
        total: totalValue,
        items: saleItemsData.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            value: item.value
        })),
        paymentsMethods: paymentsArray.map((payment) => ({
          amount: payment.amount,
          paymentMethod: payment.paymentMethod,
          details: payment.details
        })),
      };

      return formattedSales
}



  // async createSale(req) {
  //   const { customerId, items } = req.body;

  //   const itemsArray = JSON.parse(JSON.stringify(items));
   
  //   if (!customerId || !Array.isArray(itemsArray) || itemsArray.length === 0) {
  //     throw new Error('O JSON da venda está incompleto ou os itens estão incorretos.');
  //   }

  //   const transaction = await sequelize.transaction();

  //   try {
  //     const sale = await saleRepository.createSale(customerId, transaction);

  //     const productIds = itemsArray.map(item => item.productId);
  
  //     const products = await Product.findAll({
  //       where: { id: productIds },
  //       attributes: ['id', 'price'],
  //       transaction
  //     });
  
  //     const productPriceMap = {};
  //     products.forEach(product => {
  //         productPriceMap[product.id] = product.price;
  //     });
  
  
  //     let saleItemsData = itemsArray.map(item => ({
  //       saleId: sale.id,
  //       productId: item.productId,
  //       quantity: item.quantity,
  //       price: parseFloat(productPriceMap[item.productId]),
  //       value: parseFloat((item.quantity * productPriceMap[item.productId]).toFixed(2))
  //     }));
  
  
  //     if (!Array.isArray(saleItemsData)) {
  //         throw new Error("Erro interno: `saleItemsData` deveria ser um array.");
  //     }
  
  //     // 🔹 Registrar saída no estoque para cada item vendido
  //     for (const item of saleItemsData) {
        
  //       await stockService.registerStocksEntry({
  //         productId: item.productId,
  //         quantity: item.quantity,
  //         type: "EXIT",  // 🔥 Saída de estoque
  //         saleId: sale.id,
  //         reason: "Venda realizada"
  //       }, transaction);
  //     }

  //     const totalValue = parseFloat(
  //         saleItemsData.reduce((sum, item) => sum + parseFloat(item.value), 0) 
  //     ).toFixed(2);

  //     await saleRepository.updateSaleValue(sale.id, totalValue, transaction);
        
  //     await transaction.commit();

  //     return {
  //       saleId: sale.id,
  //       customerId: sale.customerId,
  //       value: totalValue,
  //       items: saleItemsData.map(item => ({
  //         productId: item.productId,
  //         quantity: item.quantity,
  //         price: item.price,
  //         value: item.value
  //       }))
  //     };
  //   } catch (error) {
  //     await transaction.rollback();
  //     throw error;
  //   }
  // }
   
  async updateSale(saleId, updateData) {
    const { customerId, items } = updateData;

    const transaction = await sequelize.transaction(); 
    let saleItemsData = [];

    try {
        const sale = await saleRepository.findByPk(saleId, { transaction });
        if (!sale) {
            throw new Error('Venda não encontrada.');
        }

        const numericSaleId = Number(saleId);

        if (customerId) {
            await saleRepository.update(numericSaleId, { customerId }, transaction);
        }

        let totalValue = 0;

        if (Array.isArray(items) && items.length > 0) {
            const productIds = items.map(item => item.productId);
            const products = await Product.findAll({
                where: { id: productIds },
                attributes: ['id', 'price'],
                transaction
            });

            const productPriceMap = {};
            products.forEach(product => {
                productPriceMap[product.id] = product.price;
            });

            await SaleItem.destroy({ where: { saleId: numericSaleId }, transaction });

            saleItemsData = items.map(item => ({
                saleId: numericSaleId,
                productId: item.productId,
                quantity: item.quantity,
                price: parseFloat(productPriceMap[item.productId]), 
                value: parseFloat((item.quantity * productPriceMap[item.productId]).toFixed(2)) 
            }));

            await SaleItem.bulkCreate(saleItemsData, { transaction });

            totalValue = saleItemsData.reduce((sum, item) => sum + item.value, 0);

            await saleRepository.updateSaleValue(numericSaleId, totalValue, transaction);
        }

        await transaction.commit();

        return {
            saleId: numericSaleId,
            customerId: sale.customerId,
            value: totalValue,
            items: saleItemsData.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
                value: item.value
            }))
        };

    } catch (error) {
        if (transaction.finished !== 'commit') {
            await transaction.rollback(); 
        }
        throw error;
    }
  }

  async deleteSale(id) {
    return saleRepository.destroy(id);
  }

  async activateSale(id) {

    const sale = await saleRepository.findByPk(id);

    if (!sale) {
      return null;
    }

    return saleRepository.update(id, { active: true });
  }
  
  async deactivateSale(id) {
    const sale = await saleRepository.findByPk(id);

    if (!sale) {
      return null; 
    }

    return saleRepository.update(id, { active: false });
  }
}

module.exports = new SaleService();
