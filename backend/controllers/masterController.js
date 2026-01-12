const { 
  sequelize, 
  TariffSubHead, 
  PackingType, 
  SpinningCount, 
  Account, 
  Product, 
  Broker, 
  Transport, 
  InvoiceType, 
  OrderHeader, 
  OrderDetail, 
  RG1Production, 
  DespatchEntry 
} = require('../models');
const { Op } = require('sequelize');

/**
 * GENERIC MASTER CONTROLLER FACTORY
 * This handles all standard Master tables (Images 1-5, 7, 8, 12).
 * It supports the "Like" vs "=" search condition seen in your software.
 */
const createMasterController = (Model, defaultSearchField, includeModels = []) => ({
  // CREATE
  create: async (req, res) => {
    try {
      const record = await Model.create(req.body);
      const fullRecord = await Model.findByPk(record.id || record.account_code || record.product_code || record.tariff_code, { 
        include: includeModels 
      });
      res.status(201).json({ success: true, data: fullRecord });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // GET ALL with Dynamic Search Logic
  getAll: async (req, res) => {
    try {
      const { searchField, value, condition } = req.query;
      let where = {};

      if (value && value.trim() !== "") {
        const field = searchField || defaultSearchField;
        // Implements the logic from the "Condition" dropdown in your UI
        if (condition === 'Like') {
          where[field] = { [Op.like]: `%${value}%` };
        } else {
          where[field] = value;
        }
      }

      const records = await Model.findAll({
        where,
        include: includeModels,
        order: [['createdAt', 'DESC']]
      });
      res.status(200).json({ success: true, data: records });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // UPDATE
  update: async (req, res) => {
    try {
      const id = req.params.id;
      const record = await Model.findByPk(id);
      if (!record) return res.status(404).json({ success: false, message: 'Record not found' });

      await record.update(req.body);
      const updated = await Model.findByPk(id, { include: includeModels });
      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // DELETE
  delete: async (req, res) => {
    try {
      const deleted = await Model.destroy({ where: { id: req.params.id } });
      if (!deleted) return res.status(404).json({ success: false, message: 'Record not found' });
      res.status(200).json({ success: true, message: 'Deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
});

/**
 * TRANSACTIONAL CONTROLLER FOR ORDERS (Images 9, 10, 11)
 * Handles "Head" and "Detail" tabs simultaneously using a SQL Transaction.
 */
const orderController = {
  create: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const { Details, ...headerData } = req.body;
      
      // Create Order Header
      const order = await OrderHeader.create(headerData, { transaction: t });
      
      // Create multiple Order Details (the grid rows)
      if (Details && Details.length > 0) {
        const items = Details.map(item => ({ ...item, order_id: order.id }));
        await OrderDetail.bulkCreate(items, { transaction: t });
      }

      await t.commit();
      
      // Return the full Order with all associated details and product specs
      const fullOrder = await OrderHeader.findByPk(order.id, {
        include: [
          { model: Account, as: 'Party' },
          { model: Broker, as: 'Broker' },
          { model: OrderDetail, as: 'Details', include: [{ model: Product, as: 'Product' }] }
        ]
      });
      res.status(201).json({ success: true, data: fullOrder });
    } catch (error) {
      await t.rollback();
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getAll: async (req, res) => {
    try {
      const orders = await OrderHeader.findAll({
        include: [
          { model: Account, as: 'Party' },
          { model: Broker, as: 'Broker' },
          { model: Transport, as: 'Transport' },
          { model: OrderDetail, as: 'Details', include: [{ model: Product, as: 'Product' }] }
        ]
      });
      res.status(200).json({ success: true, data: orders });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

/**
 * EXPORTING CONTROLLERS MAPPED TO YOUR UI SCREENS
 */
module.exports = {
  // Image 1: Product Master
  productController: createMasterController(Product, 'product_name', [
    { model: TariffSubHead, as: 'Tariff' },
    { model: PackingType, as: 'Packing' },
    { model: SpinningCount, as: 'Count' }
  ]),

  // Image 2: Tariff Master
  tariffController: createMasterController(TariffSubHead, 'tariff_name'),

  // Image 3: Transport Master
  transportController: createMasterController(Transport, 'transport_name'),

  // Image 4: Broker Master
  brokerController: createMasterController(Broker, 'broker_name'),

  // Image 5: Packing Type Master
  packingTypeController: createMasterController(PackingType, 'packing_type'),

  // Images 7 & 8: Accounts Master
  accountController: createMasterController(Account, 'account_name'),
  // Image 1: Spinning Count Master (Dropdown source)
  spinningCountController: createMasterController(
    SpinningCount,
    'count_name'
  ),

  // Image 12: Invoice Type Master
  invoiceTypeController: createMasterController(InvoiceType, 'invoice_type_name'),

  // Image 12 (Bottom): RG1 Production
  productionController: createMasterController(RG1Production, 'date', [
    { model: Product, as: 'Product' },
    { model: PackingType, as: 'Packing' }
  ]),

  // Images 13 & 14: Despatch Entry
  despatchController: createMasterController(DespatchEntry, 'load_no', [
    { model: Transport, as: 'Transport' }
  ]),

  // Images 9, 10, 11: Order Confirmation (Master-Detail logic)
  orderController
};