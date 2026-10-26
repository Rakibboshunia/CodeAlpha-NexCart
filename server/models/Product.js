const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Product name is required'], trim: true },
    description: { type: String, required: [true, 'Product description is required'] },
    price: { type: Number, required: [true, 'Product price is required'], min: 0 },
    originalPrice: { type: Number, default: 0 },
    category: {
      type: String,
      required: true,
      enum: ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Beauty', 'Toys', 'Food'],
    },
    brand: { type: String, required: true },
    images: [{ type: String }],
    stock: { type: Number, required: true, default: 0, min: 0 },
    sold: { type: Number, default: 0 },
    reviews: [reviewSchema],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function () {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
