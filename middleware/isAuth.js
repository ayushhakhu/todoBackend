const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  const token = await req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(422).json({ message: "No token provided" });
  }
  try {
    const decodedToken = await jwt.verify(token, "somebigString");
    req.email = decodedToken.email;
    next();
  } catch (error) {
    next(error);
  }
};
