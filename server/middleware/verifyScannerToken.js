const jwt = require("jsonwebtoken");

const verifyScannerToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ message: "No token provided." });
  }

  const accessToken = token.split(" ")[1];

  jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Failed to authenticate token." });
    }

    req.userId = decoded.id;

    if (
      decoded.role === "admin" ||
      decoded.role === "scanner" ||
      decoded.role === "member"
    ) {
      next();
    } else {
      return res
        .status(403)
        .json({ message: "You do not have the necessary permissions." });
    }
  });
};

module.exports = {
  verifyScannerToken,
};
