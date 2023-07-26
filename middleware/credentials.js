const allowedOrigins = require("../config/allowedOrigins");

const credentials = (req, res, next) => {
  // Extra security for the cors
  const origin = req.headers.origin;
  if (!allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Credentials", true);
  }

  next();
};

module.exports = credentials;
