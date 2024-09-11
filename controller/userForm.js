const UserSchema = require("../model/User");
const bcrypt = require("bcryptjs");
// const joi = require("joi");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const cloudinary = require("cloudinary").v2;
const { parse } = require("date-fns");

//user registration

const userRegiser = async (req, res) => {
  const { username, email, password, dateOfBirth, gender } = req.body;

  const parsedDateOfBirth = parse(dateOfBirth, "dd/MM/yyyy", new Date());

  if (!(username && email && password && dateOfBirth && gender)) {
    res.status(400).json({
      message: "Please fill all field",
    });
  }
  const userExist = await UserSchema.findOne({ email });

  if (userExist) {
    return res.status(401).json({
      message: "User already exist ",
    });
  }

  //password bcrypt
  const hashPassword = await bcrypt.hash(String(password), 10);

  const user = await UserSchema.create({
    username,
    email,
    password: hashPassword,
    dateOfBirth: parsedDateOfBirth,
    gender,
  });
  //generate token

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "2h",
  });
  // user.token = token;
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });

  user.password = undefined;
  res.status(200).json({
    success: true,
    message: "Account created successfully",
    token,
    userData: user,
  });
};

//email check

const emailExist = async (req, res) => {
  const { email } = req.body;

  const isExist = await UserSchema.findOne({ email });

  if (isExist) {
    console.log(email, "just for  check in exist");
    return res.status(409).json({
      message: "User already exist",
      success: false,
    });
  } else {
    return res.status(200).json({
      message: "New user",
      success: true,
    });
  }
};

//User  Login
const userLogin = async (req, res) => {
  const { email, username, password } = req.body;

  if (!(email || username) || !password) {
    res.status(400).send("Please fill all fields");
  }

  const userData = await UserSchema.findOne({
    $or: [{ email: email }, { username: username }],
  });
  if (!userData) {
    res.status(404).json({
      message: "User not found",
    });
  }
  const passwordMatch = await bcrypt.compare(
    String(password),
    userData.password
  );
  if (!passwordMatch) {
    return res.status(400).json({
      success: false,
      message: "Incorrect password",
    });
  }
  // const token = jwt.sign({ id: userData._id }, process.env.JWT_SECRET);
  const token = jwt.sign({ id: userData._id }, process.env.JWT_SECRET);

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });

  res.status(200).json({
    userData,
    token,
    message: "Login successfull",
  });
};

//google

const googleLogin = async (req, res) => {
  const { access_token } = req.body;

  const response = await fetch(
    `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${access_token}`
  );
  const googleData = await response.json();
  const { email, name, picture } = googleData;
  let user = await UserSchema.findOne({ email });

  if (!user) {
    user = new UserSchema({
      username: name,
      email,
      loginMethod: "Google",
      profilePicture: picture,
    });
    await user.save();
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "2h",
  });

  res.cookie("token", token, {
    httpOnly: true, // Makes cookie inaccessible via client-side JavaScript
    secure: process.env.NODE_ENV === "production", // Ensure this is true in production (HTTPS only)
    sameSite: "None", // Necessary if you're making cross-site requests
  });

  res.status(200).json({
    userData: user,
    token: token,
    message: "Login successfull",
  });
};

//forgot password

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await UserSchema.findOne({ email });

  if (!user) {
    res.status(404).send("user not exist");
  }
  const token = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000;
  await user.save();
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.email,
      pass: process.env.App_pass,
    },
  });
  const mailOptions = {
    to: user.email,
    from: process.env.email,
    subject: "Password Reset",
    text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
    Please click on the following link, or paste this into your browser to complete the process:\n\n
   https://spotify-client-psi-black.vercel.app/reset-password/${token}\n\n
    If you did not request this, please ignore this email and your password will remain unchanged.\n`,
  };

  await transporter.sendMail(mailOptions);

  res.status(200).send("Reset link sent to your email");
};

//password save

const passwordSave = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await UserSchema.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) {
    res.status(400).send("Password reset token is invalid ");
  }
  user.password = bcrypt.hashSync(password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  res.status(200).send("Password has been reset");
};

// user view profail

const viewProfail = async (req, res) => {
  const { token } = req.cookies;

  const valid = await jwt.verify(token, process.env.JWT_SECRET);
  const userId = valid.id;

  const user = await UserSchema.findById({ _id: userId });

  res.status(200).json({
    status: "Succes",
    user,
  });
};

// edit profail

const editProfaile = async (req, res) => {
  const { token } = req.cookies;
  const valid = await jwt.verify(token, process.env.JWT_SECRET);

  const userId = valid.id;

  const data = req.body;
  const { username, email, dateOfBirth, gender, profilePicture } = data;

  const user = await UserSchema.findById({ _id: userId });

  const emailExist = await UserSchema.findOne({ email, username });
  if (emailExist) {
    return res.status(400).json({
      message: "email or username already exist",
    });
  }

  const updatedUser = await UserSchema.findByIdAndUpdate(
    userId,
    {
      username,
      email,
      dateOfBirth,
      gender,
      profilePicture: req.cloudinaryImageUrl || user.profilePicture,
    },
    { new: true }
  );

  res.status(201).json({
    message: "profail updated",
    updatedUser,
  });
};

module.exports = {
  userRegiser,
  userLogin,
  googleLogin,
  forgotPassword,
  passwordSave,
  viewProfail,
  editProfaile,
  emailExist,
};
