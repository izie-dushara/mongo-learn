const User = require("../model/User");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  // required validation
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username and password are required." });

  // check if user is found
  const foundUser = await User.findOne({ username: user }).exec();
  if (!foundUser) return res.sendStatus(401); //Unauthorized

  // Evaluate password
  const match = await bcrypt.compare(pwd, foundUser.password);

  if (match) {
    // get role values
    const roles = Object.values(foundUser.roles);
    // create JWTs
    const accessToken = jwt.sign(
      // reference into access token
      { UserInfo: { username: foundUser.username, roles: roles } },
      // Access the secret from .env
      process.env.ACCESS_TOKEN_SECRET,
      // Token expiration
      { expiresIn: "60s" }
    );

    const refreshToken = jwt.sign(
      { username: foundUser.username },
      // Access the secret from .env
      process.env.REFRESH_TOKEN_SECRET,
      // Token expiration
      { expiresIn: "1d" }
    );

    // Save refresh token with user in database - for logout process
    foundUser.refreshToken = refreshToken;
    const result = await foundUser.save();
    console.log(result);

    // Store the tokens in memory and as cookies - httpOnly
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });
    res.json({ accessToken });
  } else {
    res.sendStatus(401); //Unauthorized
  }
};

module.exports = { handleLogin };
