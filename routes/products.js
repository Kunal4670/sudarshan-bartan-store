const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Product = require('../models/Product');

// ── MULTER SETUP ──
const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, 'product-' + Date.now() + ext);
  }
});
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  allowed.test(path.extname(file.originalname).toLowerCase())
    ? cb(null, true)
    : cb(new Error('Only jpg, png, webp images allowed'));
};
const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

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

// POST add product with optional image (owner only)
router.post('/', ownerOnly, upload.single('image'), async (req, res) => {
  try {
    const { name, category, description, price, stock, emoji } = req.body;
    const image = req.file ? req.file.filename : '';
    const product = new Product({ name, category, description, price, stock, emoji, image });
    await product.save();
    res.status(201).json({ success: true, product, message: 'Product added successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT update product with optional new image (owner only)
router.put('/:id', ownerOnly, upload.single('image'), async (req, res) => {
  try {
    const { name, category, description, price, stock, emoji, inStock } = req.body;
    const updateData = { name, category, description, price, stock, emoji, inStock };
    if (req.file) {
      // Delete old image if exists
      const old = await Product.findById(req.params.id);
      if (old && old.image) {
        const oldPath = path.join(uploadDir, old.image);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      updateData.image = req.file.filename;
    }
    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product, message: 'Product updated successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE product + its image (owner only)
router.delete('/:id', ownerOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    // Delete image file
    if (product.image) {
      const imgPath = path.join(uploadDir, product.image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }
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
