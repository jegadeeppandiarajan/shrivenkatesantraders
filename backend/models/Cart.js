const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, "Quantity cannot be less than 1"],
    default: 1,
  },
  price: {
    type: Number,
    required: true,
  },
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
    totalItems: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate totals before saving
cartSchema.pre("save", function (next) {
  this.totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
  this.totalPrice = this.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  next();
});

// Helper to get product ID string (handles both populated and unpopulated)
const getProductIdString = (product) => {
  if (!product) return null;
  // If populated, product is an object with _id
  if (product._id) return product._id.toString();
  // If not populated, product is an ObjectId
  return product.toString();
};

// Method to add item to cart
cartSchema.methods.addItem = async function (productId, quantity, price) {
  const targetId = productId.toString();
  const existingItemIndex = this.items.findIndex(
    (item) => getProductIdString(item.product) === targetId
  );

  if (existingItemIndex > -1) {
    this.items[existingItemIndex].quantity += quantity;
    this.items[existingItemIndex].price = price;
  } else {
    this.items.push({ product: productId, quantity, price });
  }

  return this.save();
};

// Method to remove item from cart
cartSchema.methods.removeItem = async function (productId) {
  const targetId = productId.toString();
  this.items = this.items.filter(
    (item) => getProductIdString(item.product) !== targetId
  );
  return this.save();
};

// Method to update item quantity
cartSchema.methods.updateItemQuantity = async function (productId, quantity) {
  const targetId = productId.toString();
  const itemIndex = this.items.findIndex(
    (item) => getProductIdString(item.product) === targetId
  );

  if (itemIndex > -1) {
    if (quantity <= 0) {
      this.items.splice(itemIndex, 1);
    } else {
      this.items[itemIndex].quantity = quantity;
    }
  }

  return this.save();
};

// Method to clear cart
cartSchema.methods.clearCart = async function () {
  this.items = [];
  return this.save();
};

// Index (user already indexed via unique: true)

module.exports = mongoose.model("Cart", cartSchema);
