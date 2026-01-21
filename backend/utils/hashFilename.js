const crypto = require("crypto");

module.exports = (originalName) => {
  return (
    crypto
      .createHash("sha256")
      .update(Date.now() + originalName)
      .digest("hex") + ".pdf"
  );
};
