const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { chatbotReply } = require("../controllers/chatbotController");

/* 🔥 AUTH MUST BE HERE */
router.post("/chat", auth, chatbotReply);

module.exports = router;
