const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {

  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ error: "No token" });
  }

  const token = header.split(" ")[1];

  try {
console.log("ISSUE SECRET:", process.env.JWT_SECRET);
console.log("ISSUE token:", token);
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );
console.log("ISSUE decoded :", decoded );

    req.user = decoded;

    next();

  } catch {

    return res.status(401).json({ error: "Invalid token" });
  }
};
