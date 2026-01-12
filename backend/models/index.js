const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * 1. TARIFF SUB HEAD MASTER (Image 2)
 * Fetched in Product Master dropdowns.
 */
const TariffSubHead = sequelize.define('TariffSubHead', {
  tariff_code: { type: DataTypes.STRING, unique: true },
  tariff_name: { type: DataTypes.STRING }, 
  tariff_no: { type: DataTypes.STRING }, // HSN Code
  product_type: { type: DataTypes.STRING }, 
  commodity: { type: DataTypes.STRING }, 
  fibre: { type: DataTypes.STRING }, 
  yarn_type: { type: DataTypes.STRING }
}, { tableName: 'tbl_TariffSubHeads' });

/**
 * 2. PACKING TYPE MASTER (Image 5)
 * Fetched in Product and Order Details.
 */
const PackingType = sequelize.define('PackingType', {
  packing_type: { type: DataTypes.STRING, allowNull: false } 
}, { tableName: 'tbl_PackingTypes' });

/**
 * 3. SPINNING COUNT MASTER
 * Dynamic source for the "Spinning Count Name" in Product Master (Image 1).
 */
const SpinningCount = sequelize.define('SpinningCount', {
  count_name: { type: DataTypes.STRING, allowNull: false },
  conversion_factor_40s: { type: DataTypes.DECIMAL(10, 4) }
}, { tableName: 'tbl_SpinningCounts' });

/**
 * 4. ACCOUNTS MASTER (Images 7 & 8)
 * Source for "Party" dropdowns in Orders and Invoices.
 */
const Account = sequelize.define('Account', {
  account_code: { type: DataTypes.STRING, primaryKey: true },
  account_name: { type: DataTypes.STRING, allowNull: false },
  account_group: { type: DataTypes.STRING },
  place: { type: DataTypes.STRING },
  address: { type: DataTypes.TEXT },
  pincode: { type: DataTypes.STRING },
  state: { type: DataTypes.STRING },
  gst_no: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  phone_no: { type: DataTypes.STRING },
  opening_credit: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 }
}, { tableName: 'tbl_Accounts' });

/**
 * 5. PRODUCT MASTER (Image 1)
 */
const Product = sequelize.define('Product', {
  product_code: { type: DataTypes.STRING, unique: true },
  product_name: { type: DataTypes.STRING, allowNull: false },
  short_description: { type: DataTypes.STRING },
  wt_per_cone: { type: DataTypes.DECIMAL(10, 3) },
  cones_per_pack: { type: DataTypes.INTEGER },
  pack_nett_wt: { type: DataTypes.DECIMAL(10, 3) },
  actual_count: { type: DataTypes.INTEGER },
  charity_rs: { type: DataTypes.DECIMAL(10, 2) }
}, { tableName: 'tbl_Products' });

/**
 * 6. BROKER MASTER (Image 4)
 */
const Broker = sequelize.define('Broker', {
  broker_code: { type: DataTypes.STRING, unique: true },
  broker_name: { type: DataTypes.STRING, allowNull: false },
  commission_pct: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
  address: { type: DataTypes.TEXT }
}, { tableName: 'tbl_Brokers' });

/**
 * 7. TRANSPORT MASTER (Image 3)
 */
const Transport = sequelize.define('Transport', {
  transport_code: { type: DataTypes.STRING, unique: true },
  transport_name: { type: DataTypes.STRING, allowNull: false },
  place: { type: DataTypes.STRING },
  address: { type: DataTypes.TEXT }
}, { tableName: 'tbl_Transports' });

/**
 * 8. INVOICE TYPE MASTER (Image 12)
 * Stores logic for dynamic tax/charity calculation strings.
 */
const InvoiceType = sequelize.define('InvoiceType', {
  invoice_code: { type: DataTypes.INTEGER, unique: true },
  invoice_type_name: { type: DataTypes.STRING },
  sales_type: { type: DataTypes.STRING },
  assess_value_formula: { type: DataTypes.STRING },
  igst_pct: { type: DataTypes.DECIMAL(5, 2) },
  charity_formula: { type: DataTypes.STRING },
  is_account_posting: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { tableName: 'tbl_InvoiceTypes' });

/**
 * 9. ORDER HEADER (Images 6, 9, 10)
 */
const OrderHeader = sequelize.define('OrderHeader', {
  order_no: { type: DataTypes.STRING, unique: true },
  date: { type: DataTypes.DATEONLY },
  place: { type: DataTypes.STRING },
  is_with_order: { type: DataTypes.BOOLEAN },
  status: { type: DataTypes.STRING, defaultValue: 'OPEN' }
}, { tableName: 'tbl_OrderHeaders' });

/**
 * 10. ORDER DETAIL (Images 11 & 12)
 */
const OrderDetail = sequelize.define('OrderDetail', {
  rate_cr: { type: DataTypes.DECIMAL(12, 2) },
  rate_imm: { type: DataTypes.DECIMAL(12, 2) },
  rate_per: { type: DataTypes.DECIMAL(10, 2) },
  qty: { type: DataTypes.DECIMAL(12, 2) },
  bag_wt: { type: DataTypes.DECIMAL(12, 2) }
}, { tableName: 'tbl_OrderDetails' });

/**
 * 11. RG1 PRODUCTION (Image 12)
 */
const RG1Production = sequelize.define('RG1Production', {
  date: { type: DataTypes.DATEONLY },
  prv_day_closing: { type: DataTypes.DECIMAL(15, 2) },
  production_kgs: { type: DataTypes.DECIMAL(15, 2) },
  invoice_kgs: { type: DataTypes.DECIMAL(15, 2) },
  stock_kgs: { type: DataTypes.DECIMAL(15, 2) },
  stock_bags: { type: DataTypes.INTEGER },
  stock_loose: { type: DataTypes.DECIMAL(12, 2) }
}, { tableName: 'tbl_RG1Productions' });

/**
 * 12. DESPATCH ENTRY (Image 13 & 14)
 */
const DespatchEntry = sequelize.define('DespatchEntry', {
  load_no: { type: DataTypes.STRING, unique: true },
  load_date: { type: DataTypes.DATEONLY },
  lr_no: { type: DataTypes.STRING },
  lr_date: { type: DataTypes.DATEONLY },
  vehicle_no: { type: DataTypes.STRING },
  delivery_place: { type: DataTypes.STRING },
  insurance_no: { type: DataTypes.STRING },
  in_time: { type: DataTypes.STRING }, // Use string to match "03:37 PM" format
  out_time: { type: DataTypes.STRING },
  no_of_bags: { type: DataTypes.DECIMAL(10, 2) },
  freight_total: { type: DataTypes.DECIMAL(12, 2) },
  freight_per_bag: { type: DataTypes.DECIMAL(12, 2) }
}, { tableName: 'tbl_DespatchEntries' });

// ==========================================
// ASSOCIATIONS (No Static Values Policy)
// ==========================================

// Product Master dropdowns
TariffSubHead.hasMany(Product, { foreignKey: 'tariff_id' });
Product.belongsTo(TariffSubHead, { foreignKey: 'tariff_id', as: 'Tariff' });

PackingType.hasMany(Product, { foreignKey: 'packing_type_id' });
Product.belongsTo(PackingType, { foreignKey: 'packing_type_id', as: 'Packing' });

SpinningCount.hasMany(Product, { foreignKey: 'spinning_count_id' });
Product.belongsTo(SpinningCount, { foreignKey: 'spinning_count_id', as: 'Count' });

// Order Header dropdowns
Account.hasMany(OrderHeader, { foreignKey: 'account_id' });
OrderHeader.belongsTo(Account, { foreignKey: 'account_id', as: 'Party' });

Broker.hasMany(OrderHeader, { foreignKey: 'broker_id' });
OrderHeader.belongsTo(Broker, { foreignKey: 'broker_id', as: 'Broker' });

Transport.hasMany(OrderHeader, { foreignKey: 'transport_id' });
OrderHeader.belongsTo(Transport, { foreignKey: 'transport_id', as: 'Transport' });

InvoiceType.hasMany(OrderHeader, { foreignKey: 'invoice_type_id' });
OrderHeader.belongsTo(InvoiceType, { foreignKey: 'invoice_type_id', as: 'InvoiceType' });

// Master-Detail link for Orders
OrderHeader.hasMany(OrderDetail, { foreignKey: 'order_id', as: 'Details' });
OrderDetail.belongsTo(OrderHeader, { foreignKey: 'order_id' });

Product.hasMany(OrderDetail, { foreignKey: 'product_id' });
OrderDetail.belongsTo(Product, { foreignKey: 'product_id', as: 'Product' });

// Production linking
Product.hasMany(RG1Production, { foreignKey: 'product_id' });
RG1Production.belongsTo(Product, { foreignKey: 'product_id', as: 'Product' });

PackingType.hasMany(RG1Production, { foreignKey: 'packing_type_id' });
RG1Production.belongsTo(PackingType, { foreignKey: 'packing_type_id', as: 'Packing' });

// Despatch linking
Transport.hasMany(DespatchEntry, { foreignKey: 'transport_id' });
DespatchEntry.belongsTo(Transport, { foreignKey: 'transport_id', as: 'Transport' });

module.exports = {
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
};