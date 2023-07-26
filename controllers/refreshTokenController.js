const User = require("../model/User");
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  // required validation
  if (!cookies?.jwt) return res.sendStatus(401); //unauthorized
  // define refresh token
  const refreshToken = cookies.jwt;

  // check if user with token is found
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) return res.sendStatus(403); //Forbidden

  // Evaluate jwt
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    // validation
    (err, decoded) => {
      if (err || foundUser.username !== decoded.username)
        return res.sendStatus(403);
      // get roles value
      const roles = Object.values(foundUser.roles);
      // create new access token
      const accessToken = jwt.sign(
        { UserInfo: { username: decoded.username, roles: roles } },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "60s" }
      );
      // Send access token
      res.json({ accessToken });
    }
  );
};

module.exports = { handleRefreshToken };
