const User = require("../model/User");

const handleLogout = async (req, res) => {
  // On client side, remember to delete the accessToken

  const cookies = req.cookies;
  // required validation
  if (!cookies?.jwt) return res.sendStatus(204); // No content
  // define refresh token
  const refreshToken = cookies.jwt;

  // check if refreshToken in db?
  const foundUser = await User.findOne({ refreshToken }).exec();
  // User not found, can just clear
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true });
    return res.sendStatus(204);
  }

  // Delete refreshToken in db
  foundUser.refreshToken = "";
  // save back to db
  const result = await foundUser.save();
  console.log(result);

  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  // secure: true - only server on https
  res.sendStatus(204);
};

module.exports = { handleLogout };
