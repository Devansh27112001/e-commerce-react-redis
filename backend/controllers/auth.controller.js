import { redis } from "../lib/redis.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
const generateTokens = (userId) => {
  // generate access token: encrypts userId with secret key and returns token
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};
// Store refresh token in redis
const storeToken = async (userId, refreshToken) => {
  await redis.set(
    `refresh_token:${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60
  ); // 7 days
};

// Setting the tokens in cookies
const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true, // Prevents XSS attacks - cross-site scripting
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // Prevents CSRF attacks - cross-site request forgery
    maxAge: 15 * 60 * 1000, // 15 minutes in milliseconds
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, // Prevents XSS attacks - cross-site scripting
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // Prevents CSRF attacks - cross-site request forgery
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  });
};

export const signUp = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const userExist = await User.findOne({ email });
    if (userExist) return res.status(400).json({ msg: "User already exists" });
    // cannot use req.body directly here as someone could send role: "admin" which will give them admin access.
    const user = await User.create({ name, email, password });
    // Authenticate user
    const { accessToken, refreshToken } = generateTokens(user._id);
    await storeToken(user._id, refreshToken);
    // Set Cookies
    setCookies(res, accessToken, refreshToken);

    res.status(201).json({
      status: "Success",
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.log("Error in authController:signUp", err.message);
    res.status(500).json({ status: "failed", msg: err.message });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    // In the comparePassword method, 'this' will point to the user document.
    if (user && (await user.comparePassword(password))) {
      const { accessToken, refreshToken } = generateTokens(user._id);
      await storeToken(user._id, refreshToken);
      // Set Cookies
      setCookies(res, accessToken, refreshToken);
      res.status(200).json({
        status: "Success",
        message: "User logged in successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      res
        .status(401)
        .json({ status: "failed", message: "Incorrect email or password" });
    }
  } catch (err) {
    console.log("Error in authController:login", err.message);
    res.status(500).json({ status: "failed", message: err.message });
  }
};

export const logout = async (req, res) => {
  try {
    // We get the refreshToken from the cookies.
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      // We decode the refreshToken and get a decoded object that has the userId, iam and exp properties
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      console.log(decoded);
      // We use the userId from the decoded object to delete the refreshToken from Redis as we have save the refreshToken in Redis as `refresh_token:userId`
      await redis.del(`refresh_token:${decoded.userId}`);
      res.clearCookie("refreshToken");
      res.clearCookie("accessToken");
      res.json({ status: "Success", message: "Logged out successfully" });
    }
  } catch (err) {
    console.log("Error in authController:logout", err.message);
    res
      .status(500)
      .json({ status: "failed", message: "Server error", error: err.message });
  }
};

// The accessToken is valid for 15 minutes. If it expires, the user will provide the refreshToken to get a new accessToken
export const refreshToken = async (req, res) => {
  try {
    // Get the refreshtoken from the cookie
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res
        .status(401)
        .json({ status: "failed", message: "No refresh token in cookies" });
    }
    // Decode the refreshToken
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Get the refreshToken for the userId from redis
    const storedToken = await redis.get(`refresh_token:${decoded.userId}`);

    // Compare both the tokens
    if (storedToken !== refreshToken) {
      return res
        .status(401)
        .json({ status: "failed", message: "Invalid refresh Token" });
    }

    // Generate the accessToken if it is valid
    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    // Store the newly generated accessToken in the cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true, // Prevents XSS attacks - cross-site scripting
      maxAge: 15 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict", // Prevents CSRF attacks - cross-site request forgery
    });

    res
      .status(200)
      .json({ status: "success", message: "Token refreshed successfully" });
  } catch (err) {
    console.log("Error in authController:refreshToken", err.message);
    res
      .status(401)
      .json({ status: "failed", message: "Server error", error: err.message });
  }
};

// TODO: implement getProfile later
// export const getProfile = async (req, res) => {};
