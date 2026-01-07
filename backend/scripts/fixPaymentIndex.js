const mongoose = require("mongoose");
require("dotenv").config();

async function fixPaymentIndex() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const collection = mongoose.connection.collection("payments");

    // List all indexes
    console.log("\nCurrent indexes:");
    const indexes = await collection.indexes();
    indexes.forEach((idx) => console.log(`  - ${idx.name}:`, idx.key));

    // Drop the problematic index
    try {
      await collection.dropIndex("stripePaymentIntentId_1");
      console.log("\n✅ Dropped stripePaymentIntentId_1 index");
    } catch (e) {
      console.log("\n⚠️ Could not drop stripePaymentIntentId_1:", e.message);
    }

    // Also clean up any payment records with null stripePaymentIntentId
    const result = await collection.deleteMany({
      stripePaymentIntentId: null,
      status: "pending",
    });
    console.log(
      `\n✅ Cleaned up ${result.deletedCount} pending payment records with null paymentIntentId`
    );

    console.log("\n✅ Done! You can now restart the server.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

fixPaymentIndex();
