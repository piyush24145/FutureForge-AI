module.exports = (req, res, next) => {
  // Initialise chat history for this session if missing
  if (!req.session.chatHistory) {
    req.session.chatHistory = [];
  }
  // Ensure the request body uses the server‑side stored history
  req.body.history = req.session.chatHistory;
  next();
};
