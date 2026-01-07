const validator = require("validator");

// Validate product input
const validateProduct = (req, res, next) => {
  const errors = [];
  const { name, description, category, price, stock } = req.body;

  if (!name || name.trim().length === 0) {
    errors.push("Product name is required");
  } else if (name.length > 200) {
    errors.push("Product name cannot exceed 200 characters");
  }

  if (!description || description.trim().length === 0) {
    errors.push("Product description is required");
  }

  if (!category) {
    errors.push("Category is required");
  } else {
    const validCategories = [
      "Pipes",
      "Motors",
      "Accessories",
      "Fittings",
      "Valves",
      "Pumps",
    ];
    if (!validCategories.includes(category)) {
      errors.push("Invalid category");
    }
  }

  if (price === undefined || price === null) {
    errors.push("Price is required");
  } else if (isNaN(price) || price < 0) {
    errors.push("Price must be a positive number");
  }

  if (stock !== undefined && (isNaN(stock) || stock < 0)) {
    errors.push("Stock must be a non-negative number");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  next();
};

// Validate order input
const validateOrder = (req, res, next) => {
  const errors = [];
  const { shippingAddress, items } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    errors.push("Order must contain at least one item");
  }

  if (!shippingAddress) {
    errors.push("Shipping address is required");
  } else {
    if (!shippingAddress.fullName) errors.push("Full name is required");
    if (!shippingAddress.phone) errors.push("Phone number is required");
    if (!shippingAddress.street) errors.push("Street address is required");
    if (!shippingAddress.city) errors.push("City is required");
    if (!shippingAddress.state) errors.push("State is required");
    if (!shippingAddress.pincode) errors.push("Pincode is required");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  next();
};

// Validate shipping address
const validateShippingAddress = (req, res, next) => {
  const errors = [];
  const { fullName, phone, street, city, state, pincode } = req.body;

  if (!fullName || fullName.trim().length === 0) {
    errors.push("Full name is required");
  }

  if (!phone) {
    errors.push("Phone number is required");
  } else if (!/^[6-9]\d{9}$/.test(phone)) {
    errors.push("Invalid phone number format");
  }

  if (!street || street.trim().length === 0) {
    errors.push("Street address is required");
  }

  if (!city || city.trim().length === 0) {
    errors.push("City is required");
  }

  if (!state || state.trim().length === 0) {
    errors.push("State is required");
  }

  if (!pincode) {
    errors.push("Pincode is required");
  } else if (!/^\d{6}$/.test(pincode)) {
    errors.push("Invalid pincode format");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  next();
};

// Sanitize input
const sanitizeInput = (req, res, next) => {
  if (req.body) {
    for (let key in req.body) {
      if (typeof req.body[key] === "string") {
        req.body[key] = validator.escape(req.body[key].trim());
      }
    }
  }
  next();
};

module.exports = {
  validateProduct,
  validateOrder,
  validateShippingAddress,
  sanitizeInput,
};
