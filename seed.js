require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const defaultProducts = [
  { name: 'Ceramic Mixing Bowl', category: 'kitchen', description: 'Handcrafted ceramic bowl, perfect for mixing and serving.', price: 549, stock: 20, emoji: '🥣' },
  { name: "Chef's Knife", category: 'kitchen', description: 'High-carbon steel blade with an ergonomic wooden handle.', price: 899, stock: 15, emoji: '🔪' },
  { name: 'Spice Jar Set', category: 'kitchen', description: 'Set of 6 glass jars with airtight lids for your spice rack.', price: 699, stock: 30, emoji: '🫙' },
  { name: 'Non-stick Kadai', category: 'kitchen', description: 'Premium non-stick kadai for everyday Indian cooking.', price: 1299, stock: 10, emoji: '🍳' },
  { name: 'Steel Tiffin Box', category: 'kitchen', description: '3-tier stainless steel tiffin box, leak-proof and durable.', price: 399, stock: 25, emoji: '🥘' },
  { name: 'Leather Notebook', category: 'stationery', description: 'A5 ruled notebook with genuine leather cover — 200 pages.', price: 399, stock: 40, emoji: '📒' },
  { name: 'Fountain Pen', category: 'stationery', description: 'Smooth writing experience with a fine-nib fountain pen.', price: 799, stock: 20, emoji: '🖋️' },
  { name: 'Washi Tape Set', category: 'stationery', description: 'Set of 10 decorative washi tapes in earthy tones.', price: 299, stock: 50, emoji: '📎' },
  { name: 'Sticky Notes Pack', category: 'stationery', description: 'Pack of 5 colorful sticky note pads for desk organization.', price: 149, stock: 60, emoji: '📝' },
  { name: 'Geometry Box', category: 'stationery', description: 'Complete geometry set with compass, protractor, and rulers.', price: 199, stock: 35, emoji: '📐' },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    const count = await Product.countDocuments();
    if (count > 0) {
      console.log(`ℹ️  Database already has ${count} products. Skipping seed.`);
    } else {
      await Product.insertMany(defaultProducts);
      console.log(`✅ Seeded ${defaultProducts.length} default products!`);
    }
    await mongoose.disconnect();
    console.log('✅ Done!');
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();
