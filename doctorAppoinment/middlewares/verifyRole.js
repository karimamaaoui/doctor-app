const jwt = require("jsonwebtoken");

const verifyRole = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send("Token is missing");
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).send("Token is missing");
  }

  const decodedToken = jwt.decode(token);

  console.log("decoded from verify role ", decodedToken);
  console.log("role from verify role", decodedToken.UserInfo.role);

  if (decodedToken.UserInfo.role === "ADMIN") {
    req.userRole = "ADMIN";
    next();
  } else if (decodedToken.UserInfo.role === "PATIENT") {
    req.userRole = "PATIENT";
    next();
  } else if (decodedToken.UserInfo.role === "DOCTOR") {
    req.userRole = "DOCTOR";
    next();
  } else {
    return res.status(403).json("Unauthorized: Invalid role");
  }
};

module.exports = verifyRole;
