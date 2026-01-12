const express = require('express');
const router = express.Router();

const controllers = require('../controllers/masterController');



/**
 * ==========================================
 * 1. MASTER ROUTES (Images 1-5, 7, 8, 12)
 * ==========================================
 */

// ACCOUNTS MASTER (Images 7 & 8)
router.post('/accounts', controllers.accountController.create);
router.get('/accounts', controllers.accountController.getAll);
router.put('/accounts/:id', controllers.accountController.update);
router.delete('/accounts/:id', controllers.accountController.delete);

// PRODUCT MASTER (Image 1)
router.post('/products', controllers.productController.create);
router.get('/products', controllers.productController.getAll);
router.put('/products/:id', controllers.productController.update);
router.delete('/products/:id', controllers.productController.delete);

// TARIFF SUB HEAD MASTER (Image 2)
router.post('/tariffs', controllers.tariffController.create);
router.get('/tariffs', controllers.tariffController.getAll);
router.put('/tariffs/:id', controllers.tariffController.update);
router.delete('/tariffs/:id', controllers.tariffController.delete);

// TRANSPORT MASTER (Image 3)
router.post('/transports', controllers.transportController.create);
router.get('/transports', controllers.transportController.getAll);
router.put('/transports/:id', controllers.transportController.update);
router.delete('/transports/:id', controllers.transportController.delete);

// BROKER MASTER (Image 4)
router.post('/brokers', controllers.brokerController.create);
router.get('/brokers', controllers.brokerController.getAll);
router.put('/brokers/:id', controllers.brokerController.update);
router.delete('/brokers/:id', controllers.brokerController.delete);

// PACKING TYPE MASTER (Image 5)
router.post('/packing-types', controllers.packingTypeController.create);
router.get('/packing-types', controllers.packingTypeController.getAll);
router.put('/packing-types/:id', controllers.packingTypeController.update);
router.delete('/packing-types/:id', controllers.packingTypeController.delete);

// INVOICE TYPE MASTER (Image 12)
router.post('/invoice-types', controllers.invoiceTypeController.create);
router.get('/invoice-types', controllers.invoiceTypeController.getAll);
router.put('/invoice-types/:id', controllers.invoiceTypeController.update);
router.delete('/invoice-types/:id', controllers.invoiceTypeController.delete);

// SPINNING COUNT MASTER (Added for Count dropdown in Image 1)
// Essential for the "No Static Values" requirement
router.post('/spinning-counts', controllers.spinningCountController.create);
router.get('/spinning-counts', controllers.spinningCountController.getAll);
router.put('/spinning-counts/:id', controllers.spinningCountController.update);
router.delete('/spinning-counts/:id', controllers.spinningCountController.delete);


/**
 * ==========================================
 * 2. TRANSACTIONAL ROUTES (Images 6, 9-14)
 * ==========================================
 */

// SALES ORDER / CONFIRMATION (Images 9, 10, 11)
// Uses specialized transactional logic for Head + Detail Grid
router.post('/orders', controllers.orderController.create);
router.get('/orders', controllers.orderController.getAll);
// Update/Delete for complex orders can be added as needed

// RG1 PRODUCTION (Image 12 - Bottom)
router.post('/production', controllers.productionController.create);
router.get('/production', controllers.productionController.getAll);
router.put('/production/:id', controllers.productionController.update);
router.delete('/production/:id', controllers.productionController.delete);

// DESPATCH ENTRY (Images 13 & 14)
router.post('/despatch', controllers.despatchController.create);
router.get('/despatch', controllers.despatchController.getAll);
router.put('/despatch/:id', controllers.despatchController.update);
router.delete('/despatch/:id', controllers.despatchController.delete);

module.exports = router;