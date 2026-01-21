module.exports = [
  {
    tag: "greeting",
    patterns: ["hi", "hii", "hello", "hey", "hai"],
    response: "Hi 👋 I am InnovateHub Assistant. How can I help you?"
  },

  {
    tag: "what_sih",
    patterns: ["what is sih", "explain sih", "sih meaning", "what is sihh"],
    response:
      "SIH (Smart India Hackathon) is a national-level innovation competition where students solve real-world problems."
  },

  {
    tag: "what_msme",
    patterns: ["what is msme", "msme meaning", "explain msme"],
    response:
      "MSME stands for Micro, Small and Medium Enterprises. InnovateHub tracks MSME-supported projects."
  },

  {
    tag: "what_research",
    patterns: ["what is research paper", "research paper meaning"],
    response:
      "Research papers are academic works published in journals or conferences."
  },

  {
    tag: "upload_pdf",
    patterns: ["how to upload pdf", "upload document", "upload file"],
    response:
      "PDFs can be uploaded while submitting Research Papers, SIH, MSME, Grants, and Publications."
  }
];
