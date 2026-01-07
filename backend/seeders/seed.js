const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Product = require("../models/Product");
const User = require("../models/User");

dotenv.config();

const products = [
  {
    name: "Industrial PVC Pipe 2 inch",
    description:
      "High durability PVC pipe suitable for industrial plumbing and fluid transfer applications.",
    category: "Pipes",
    price: 1200,
    stock: 120,
    material: "PVC",
    tags: ["industrial", "plumbing"],
    specifications: [
      { key: "Diameter", value: "2 inch" },
      { key: "Pressure Rating", value: "PN16" },
    ],
    images: [
      {
        url: "/uploads/products/pvc-2inch.png",
        alt: "Industrial PVC Pipe",
        isPrimary: true,
      },
    ],
  },
  {
    name: "Three Phase 5HP Motor",
    description:
      "Energy efficient IE3 motor ideal for agricultural pumps and industrial machinery.",
    category: "Motors",
    price: 18500,
    stock: 25,
    material: "Cast Iron",
    tags: ["motor", "ie3"],
    specifications: [
      { key: "Power", value: "5 HP" },
      { key: "Voltage", value: "415V" },
    ],
    images: [
      {
        url: "/uploads/products/motor-5hp.png",
        alt: "Three Phase Motor",
        isPrimary: true,
      },
    ],
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    await Product.deleteMany();
    await User.updateMany({}, { wishlist: [] });

    await Product.insertMany(products);

    console.log("✅ Seed data inserted");
    process.exit();
  } catch (error) {
    console.error("❌ Seed failed", error);
    process.exit(1);
  }
};

seed();
