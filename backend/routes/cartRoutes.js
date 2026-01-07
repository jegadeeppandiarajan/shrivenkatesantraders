const express = require("express");
const {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
} = require("../controllers/cartController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.get("/", getCart);
router.post("/", addItem);
router.put("/", updateItem);
router.delete("/", clearCart);
router.delete("/:productId", removeItem);

module.exports = router;
