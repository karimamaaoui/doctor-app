const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { randomString } = require("../utils/random");
const { verifyEmail ,restPasswordEmail} = require("../utils/sendEmail");
const userActive = require("../models/enums/userActive");

const register = async (req, res) => {
  const { firstname, lastname, email, password,role } = req.body;
  // Check if all required fields are provided
  if (!firstname || !lastname || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if the user with the given email already exists
    const foundUser = await User.findOne({ email: email }).exec();
    if (foundUser) {
      return res.status(401).json({ message: "User email already exists" });
    }

    // Hash the provided password
    const hashedPassword = await bcrypt.hash(password, 10);
    const codeVerification = randomString(20);

    // Create a new user in the database
    const user = await User.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
       role: role || undefined,
      verificationCode: codeVerification,
    });
    const link = `http://localhost:5000/auth/verify?code=${codeVerification}`;
    verifyEmail(email, firstname, link);
    // Generate an access token
    const accessToken = jwt.sign(
      {
        UserInfo: {
          id: user._id,
          role: user.role
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    // Generate a refresh token
    const refreshToken = jwt.sign(
      {
        UserInfo: {
          id: user._id,
          role: user.role

        },
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true, //accessible only by web server not js can access
      secure: true, //https
      sameSite: "None", //send to the domain that you deploy your app cross-site cookie
      maxAge: 7 * 24 * 60 * 60 * 1000, //expire date of the cookie  1000 1s * 60s * 60m * 24 hours * 7 numbre of days
    });

    res.status(201).json({
      accessToken,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  // Check if all required fields are provided
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    // Check if the user with the given email already exists
    const foundUser = await User.findOne({ email: email }).exec();
    if (!foundUser) {
      return res.status(401).json({ message: "User does not exist" });
    }

    // compare the password from req.body and saved in db
    const matchPassword = await bcrypt.compare(password, foundUser.password);

    if (!matchPassword)
      return res.status(401).json({ message: "Wrong Password" });

    // Generate an access token
    const accessToken = jwt.sign(
      {
        UserInfo: {
          id: foundUser._id,
          email: foundUser.email,
          role: foundUser.role

        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    // Generate a refresh token
    const refreshToken = jwt.sign(
      {
        UserInfo: {
          id: foundUser._id,
          role: foundUser.role

        },
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true, //accessible only by web server not js can access
      secure: false, //not accessible https
      sameSite: "None", //send to the domain that you deploy your app cross-site cookie
      maxAge: 7 * 24 * 60 * 60 * 1000, //expire date of the cookie  1000 1s * 60s * 60m * 24 hours * 7 numbre of days
    });

   
    res.status(201).json({
      accessToken,
      email: foundUser.email,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error : Login Error" });
  }
};


const refresh = (req, res) => {
  const cookies = req.cookies;

  // Check if jwt cookie is present
  if (!cookies || !cookies.jwt) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      // Check for token verification errors
      if (err) {
        return res.status(403).json({ message: "Forbidden" });
      }

      try {
        // Find user by ID from the decoded token
        const foundUser = await User.findById(decoded.UserInfo.id).exec();
        // Check if user exists
        if (!foundUser) {
          return res.status(401).json({ message: "Unauthorized" });
        }

        // Create a new access token
        const accessToken = jwt.sign(
          {
            UserInfo: {
              id: foundUser._id,
              role : foundUser.role
            },
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "15m" } // Specify the expiration time appropriately
        );

        // Send the new access token in the response
        return res.json({ accessToken });
      } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({ message: "Internal Server Error" });
      }
    }
  );
};

const logout = (req, res) => {
  // get the cookies that already saved
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //no content
  //delete the cookie 
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });
  res.json({ message: "Logged out" });
};

const verify = async (req, res) => {
  try {
    // Extract the 'code' property from the query parameters
    const codeObject = req.query;
    const code = codeObject.code;
    // Find the user with the provided verification code
    const user = await User.findOne({ verificationCode: code });
    // Check if the user with the given code exists
    if (!user) return res.status(400).json({ message: "Code is invalid." });
    // Activate the user and clear the verificationCode
    user.isActive = userActive.ACTIVE;
    user.verificationCode = "";
    await user.save();
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const forgotPass = async (req, res) => {
  const { email } = req.body;
  try {
    const oldUser = await User.findOne({ email });
    if (!oldUser) return res.status(400).send("User not exist!");
    const secret = process.env.ACCESS_TOKEN_SECRET + oldUser.password;
    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
      expiresIn: '5m',
    });
    const link = `http://localhost:4200/reset/${oldUser._id}/${token}`;
    restPasswordEmail(email, oldUser.firstname, link);
    res.status(200).send(link);
  } catch (error) {
    // Handle errors appropriately
    res.status(500).send("Internal Server Error");
  }
};


const resetPassword = async (req, res) => {
  try {
    const { id, token } = req.params;
    const { password } = req.body;

  
    // Decode the token to get the user's id
    const accessToken = jwt.sign(
      {
        UserInfo: {
          id: id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    
      try {
        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update the user's password in the database
        await User.findByIdAndUpdate(id, { password: hashedPassword });

        res.status(200).json({ message: "Password changed successfully",accessToken});
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      }
    
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Error processing the request" });
  }
};



module.exports = {
  register,
  login,
  refresh,
  logout,
  verify,
  forgotPass,
  resetPassword
};