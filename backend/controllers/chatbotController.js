const ResearchPaper = require("../models/ResearchPaper");
const Startup = require("../models/Startup");
const Publication = require("../models/Publication");
const Grant = require("../models/Grant");
const SIH = require("../models/SIH");
const MSME = require("../models/MSME");
const Award = require("../models/Award");

const { cleanText } = require("../utils/nlp");

exports.chatbotReply = async (req, res) => {
  try {
    const userId = req.user.id;      // ✅ FROM JWT
    const role = req.user.role;      // student / faculty
    const text = cleanText(req.body.message);

    /* GREETING */
    if (["hi", "hello", "hey", "hii"].includes(text)) {
      return res.json({ reply: "Hi 👋 How can I help you?" });
    }

    /* DEFINITIONS */
    if (text.includes("what is sih"))
      return res.json({ reply: "SIH is a national innovation hackathon for students." });

    if (text.includes("what is msme"))
      return res.json({ reply: "MSME stands for Micro, Small & Medium Enterprises." });

    if (text.includes("what is research"))
      return res.json({ reply: "Research papers are academic works published in journals." });

    /* COUNTS — 🔥 THIS IS WHERE YOUR BUG WAS */
    const query = { ownerId: userId, ownerRole: role };

    if (text.includes("research")) {
      const count = await ResearchPaper.countDocuments(query);
      return res.json({ reply: `You have submitted ${count} research papers 📄` });
    }

    if (text.includes("startup")) {
      const count = await Startup.countDocuments(query);
      return res.json({ reply: `You have ${count} startup activities 🚀` });
    }

    if (text.includes("publication")) {
      const count = await Publication.countDocuments(query);
      return res.json({ reply: `You have ${count} publications 📚` });
    }

    if (text.includes("grant")) {
      const count = await Grant.countDocuments(query);
      return res.json({ reply: `You have received ${count} grants 💰` });
    }

    if (text.includes("sih")) {
      const count = await SIH.countDocuments(query);
      return res.json({ reply: `You have ${count} SIH entries 🏆` });
    }

    if (text.includes("msme")) {
      const count = await MSME.countDocuments(query);
      return res.json({ reply: `You have ${count} MSME projects 🏭` });
    }

    if (text.includes("award")) {
      const count = await Award.countDocuments(query);
      return res.json({ reply: `You have received ${count} awards 🥇` });
    }

    return res.json({
      reply: "Sorry 😕 Ask about Research, SIH, MSME, Grants, or Awards."
    });

  } catch (err) {
    console.error("Chatbot crash:", err);
    res.json({ reply: "Server error 😕 Please try again." });
  }
};
