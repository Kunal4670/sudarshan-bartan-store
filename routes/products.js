const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Middleware: owner only
function ownerOnly(req, res, next) {
  if (req.session && req.session.isOwner) return next();
  return res.status(403).json({ success: false, message: 'Access denied. Owner only.' });
}

// GET all products (public)
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let filter = {};
    if (category && category !== 'all') filter.category = category;
    if (search) filter.name = { $regex: search, $options: 'i' };
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET single product (public)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST add product (owner only)
router.post('/', ownerOnly, async (req, res) => {
  try {
    const { name, category, description, price, stock, emoji } = req.body;
    const product = new Product({ name, category, description, price, stock, emoji });
    await product.save();
    res.status(201).json({ success: true, product, message: 'Product added successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT update product (owner only)
router.put('/:id', ownerOnly, async (req, res) => {
  try {
    const { name, category, description, price, stock, emoji, inStock } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, category, description, price, stock, emoji, inStock },
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product, message: 'Product updated successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE product (owner only)
router.delete('/:id', ownerOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, message: `"${product.name}" deleted successfully` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET stats (owner only)
router.get('/admin/stats', ownerOnly, async (req, res) => {
  try {
    const total = await Product.countDocuments();
    const kitchen = await Product.countDocuments({ category: 'kitchen' });
    const stationery = await Product.countDocuments({ category: 'stationery' });
    const outOfStock = await Product.countDocuments({ inStock: false });
    res.json({ success: true, stats: { total, kitchen, stationery, outOfStock } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
