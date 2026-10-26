const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const Product = require('../models/Product');
const User = require('../models/User');

dotenv.config();

const products = [
  {
    name: 'Sony WH-1000XM5 Wireless Headphones',
    description: 'Industry-leading noise canceling with Dual Noise Sensor technology. Next-level music with our best end-to-end processing for the ultimate listening experience.',
    price: 299.99,
    originalPrice: 399.99,
    category: 'Electronics',
    brand: 'Sony',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'],
    stock: 50,
    featured: true,
    rating: 4.8,
    numReviews: 128,
    tags: ['headphones', 'wireless', 'noise-canceling'],
  },
  {
    name: 'Apple MacBook Air M2',
    description: 'Supercharged by M2 chip. The redesigned MacBook Air is strikingly thin and brings exceptional performance with up to 18-hour battery life.',
    price: 1099.99,
    originalPrice: 1299.99,
    category: 'Electronics',
    brand: 'Apple',
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500'],
    stock: 25,
    featured: true,
    rating: 4.9,
    numReviews: 256,
    tags: ['laptop', 'macbook', 'apple'],
  },
  {
    name: 'Nike Air Max 270',
    description: 'The Nike Air Max 270 delivers an unrivaled, cushioned feel with Nike\'s biggest heel Air unit yet. All-day comfort and bold styling.',
    price: 129.99,
    originalPrice: 159.99,
    category: 'Clothing',
    brand: 'Nike',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'],
    stock: 100,
    featured: true,
    rating: 4.6,
    numReviews: 89,
    tags: ['shoes', 'sneakers', 'nike'],
  },
  {
    name: 'Samsung 4K QLED Smart TV 55"',
    description: 'Experience true-to-life colors with Quantum Dot technology. Smart TV with built-in streaming apps and voice assistant support.',
    price: 799.99,
    originalPrice: 999.99,
    category: 'Electronics',
    brand: 'Samsung',
    images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f4834b?w=500'],
    stock: 15,
    featured: true,
    rating: 4.7,
    numReviews: 67,
    tags: ['tv', 'smart-tv', '4k'],
  },
  {
    name: 'The Midnight Library',
    description: 'A dazzling novel about all the choices that go into a life well lived. A heartfelt story of second chances, regrets, and finding your true purpose.',
    price: 14.99,
    originalPrice: 18.99,
    category: 'Books',
    brand: 'Penguin',
    images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500'],
    stock: 200,
    featured: false,
    rating: 4.5,
    numReviews: 445,
    tags: ['fiction', 'bestseller', 'novel'],
  },
  {
    name: 'Instant Pot Duo 7-in-1',
    description: 'The best-selling multi-cooker combines 7 kitchen appliances in one - pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yogurt maker & warmer.',
    price: 89.99,
    originalPrice: 119.99,
    category: 'Home & Garden',
    brand: 'Instant Pot',
    images: ['https://images.unsplash.com/photo-1585515320310-259814833e62?w=500'],
    stock: 60,
    featured: false,
    rating: 4.7,
    numReviews: 312,
    tags: ['kitchen', 'cooking', 'pressure-cooker'],
  },
  {
    name: 'Levi\'s 501 Original Jeans',
    description: 'The original straight fit jean that started it all. These iconic Levi\'s 501 jeans feature the classic button fly, a regular waist and straight leg.',
    price: 59.99,
    originalPrice: 79.99,
    category: 'Clothing',
    brand: "Levi's",
    images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=500'],
    stock: 150,
    featured: false,
    rating: 4.4,
    numReviews: 198,
    tags: ['jeans', 'denim', 'fashion'],
  },
  {
    name: 'Canon EOS R50 Mirrorless Camera',
    description: 'Compact mirrorless camera with 24.2MP sensor, 4K video, Eye Detection AF, and Wi-Fi connectivity. Perfect for content creators and photography enthusiasts.',
    price: 679.99,
    originalPrice: 799.99,
    category: 'Electronics',
    brand: 'Canon',
    images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500'],
    stock: 20,
    featured: true,
    rating: 4.8,
    numReviews: 43,
    tags: ['camera', 'mirrorless', 'photography'],
  },
  {
    name: 'Yoga Mat Premium Non-Slip',
    description: 'Extra thick 6mm non-slip yoga mat with alignment lines. Eco-friendly TPE material, sweat-proof, and includes carrying strap.',
    price: 34.99,
    originalPrice: 49.99,
    category: 'Sports',
    brand: 'Manduka',
    images: ['https://images.unsplash.com/photo-1601925228518-c2ded3b876e4?w=500'],
    stock: 80,
    featured: false,
    rating: 4.6,
    numReviews: 134,
    tags: ['yoga', 'fitness', 'sports'],
  },
  {
    name: 'The Ordinary Skincare Set',
    description: 'Complete skincare routine featuring Hyaluronic Acid 2% + B5, Niacinamide 10% + Zinc 1%, and Retinol 0.2% in Squalane for healthy glowing skin.',
    price: 29.99,
    originalPrice: 44.99,
    category: 'Beauty',
    brand: 'The Ordinary',
    images: ['https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500'],
    stock: 90,
    featured: false,
    rating: 4.5,
    numReviews: 267,
    tags: ['skincare', 'beauty', 'serum'],
  },
  {
    name: 'LEGO Technic Bugatti Chiron',
    description: 'Build and display this iconic supercar model featuring a W16 engine with moving pistons, gearbox, steering and more than 3,500 pieces.',
    price: 349.99,
    originalPrice: 399.99,
    category: 'Toys',
    brand: 'LEGO',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500'],
    stock: 30,
    featured: false,
    rating: 4.9,
    numReviews: 78,
    tags: ['lego', 'toys', 'building'],
  },
  {
    name: 'Organic Cold Brew Coffee Kit',
    description: 'Everything you need to make smooth, low-acid cold brew coffee at home. Includes 1lb of organic medium-dark roast beans and a cold brew mason jar.',
    price: 24.99,
    originalPrice: 34.99,
    category: 'Food',
    brand: 'Stone Street',
    images: ['https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500'],
    stock: 120,
    featured: false,
    rating: 4.7,
    numReviews: 189,
    tags: ['coffee', 'cold-brew', 'organic'],
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected'.cyan);

    // Clear existing data
    await Product.deleteMany();
    await User.deleteMany();
    console.log('Data cleared'.red);

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@nexcart.com',
      password: 'admin123',
      role: 'admin',
    });

    // Create test user
    await User.create({
      name: 'John Doe',
      email: 'john@nexcart.com',
      password: 'test123',
      role: 'user',
    });

    // Seed products
    await Product.insertMany(products);

    console.log('✅ Data seeded successfully!'.green.bold);
    console.log('Admin: admin@nexcart.com / admin123'.yellow);
    console.log('User:  john@nexcart.com / test123'.yellow);
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`.red.bold);
    process.exit(1);
  }
};

seedDB();
