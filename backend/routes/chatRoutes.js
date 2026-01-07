const express = require("express");
const router = express.Router();
const { chatWithAI } = require("../controllers/chatController");

// POST /api/chat - Send message to AI
router.post("/", chatWithAI);

module.exports = router;
