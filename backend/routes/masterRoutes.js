const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/masterController');

const validate = (fn) => {
    if (typeof fn !== 'function') throw new Error(`Route handler is not a function! Check masterController exports.`);
    return fn;
};

// Masters
router.post('/accounts', validate(ctrl.account.create));
router.get('/accounts', validate(ctrl.account.getAll));
router.put('/accounts/:id', validate(ctrl.account.update));
router.delete('/accounts/:id', validate(ctrl.account.delete));

router.post('/brokers', validate(ctrl.broker.create));
router.get('/brokers', validate(ctrl.broker.getAll));
router.put('/brokers/:id', validate(ctrl.broker.update));
router.delete('/brokers/:id', validate(ctrl.broker.delete));

router.post('/products', validate(ctrl.product.create));
router.get('/products', validate(ctrl.product.getAll));
router.put('/products/:id', validate(ctrl.product.update));
router.delete('/products/:id', validate(ctrl.product.delete));

router.post('/transports', validate(ctrl.transport.create));
router.get('/transports', validate(ctrl.transport.getAll));
router.put('/transports/:id', validate(ctrl.transport.update));
router.delete('/transports/:id', validate(ctrl.transport.delete));

router.post('/tariffs', validate(ctrl.tariff.create));
router.get('/tariffs', validate(ctrl.tariff.getAll));
router.put('/tariffs/:id', validate(ctrl.tariff.update));
router.delete('/tariffs/:id', validate(ctrl.tariff.delete));

router.post('/packing-types', validate(ctrl.packing.create));
router.get('/packing-types', validate(ctrl.packing.getAll));
router.put('/packing-types/:id', validate(ctrl.packing.update));
router.delete('/packing-types/:id', validate(ctrl.packing.delete));

router.post('/invoice-types', validate(ctrl.invoiceType.create));
router.get('/invoice-types', validate(ctrl.invoiceType.getAll));
router.put('/invoice-types/:id', validate(ctrl.invoiceType.update));
router.delete('/invoice-types/:id', validate(ctrl.invoiceType.delete));

// Transactions
router.post('/orders', validate(ctrl.order.create));
router.get('/orders', validate(ctrl.order.getAll));
router.put('/orders/:id', validate(ctrl.order.update));
router.delete('/orders/:id', validate(ctrl.order.delete));

router.post('/production', validate(ctrl.production.create));
router.get('/production', validate(ctrl.production.getAll));
router.put('/production/:id', validate(ctrl.production.update));
router.delete('/production/:id', validate(ctrl.production.delete));

router.post('/invoices', validate(ctrl.invoice.create));
router.get('/invoices', validate(ctrl.invoice.getAll));
router.put('/invoices/approve/:id', validate(ctrl.invoice.approve));
router.put('/invoices/reject/:id', validate(ctrl.invoice.reject));
router.put('/invoices/:id', validate(ctrl.invoice.update));
router.delete('/invoices/:id', validate(ctrl.invoice.delete));

// --- NEW REPORT ROUTES ---
router.get('/reports/:reportId', validate(ctrl.reports.getReportData));
router.get('/invoices/print/:id', validate(ctrl.reports.getInvoicePrintData));

router.post('/depot-received', validate(ctrl.depotReceived.create));
router.get('/depot-received', validate(ctrl.depotReceived.getAll));
router.put('/depot-received/:id', validate(ctrl.depotReceived.update));

router.post('/despatch', validate(ctrl.despatch.create));
router.get('/despatch', validate(ctrl.despatch.getAll));
router.put('/despatch/:id', validate(ctrl.despatch.update));

module.exports = router;