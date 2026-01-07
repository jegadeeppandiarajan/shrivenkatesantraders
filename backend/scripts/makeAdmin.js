/**
 * Script to make a user an admin
 * Usage: node scripts/makeAdmin.js your-email@gmail.com
 */

require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

const email = process.argv[2];

if (!email) {
  console.log("❌ Please provide an email address");
  console.log("Usage: node scripts/makeAdmin.js your-email@gmail.com");
  process.exit(1);
}

const makeAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("📦 Connected to MongoDB");

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.log(`❌ User with email "${email}" not found`);
      console.log("\n📋 Available users:");
      const users = await User.find({}, "email name role");
      users.forEach((u) => {
        console.log(`   - ${u.email} (${u.name}) - Role: ${u.role}`);
      });
      process.exit(1);
    }

    if (user.role === "admin") {
      console.log(`✅ User "${user.name}" is already an admin!`);
    } else {
      user.role = "admin";
      await user.save();
      console.log(
        `✅ Successfully made "${user.name}" (${user.email}) an admin!`
      );
    }

    await mongoose.disconnect();
    console.log("👋 Done!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

makeAdmin();
