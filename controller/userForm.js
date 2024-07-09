const userSchema = require("../model/UserSchema");
const bcrypt = require("bcryptjs");
const joi = require("joi");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
//joi validation for user

const userValidation = (data, regType) => {
  const schema = joi.object({
    username: joi.string().required().messages({
      "string.base": "Username must be a string",
      "string.empty": "Username is required",
    }),
    email: joi.string().email().required().messages({
      "string.base": "Email must be a string",
      "string.email": "Email must be a valid email address",
      "string.empty": "Email is required",
    }),
    password:
      regType === "Google"
        ? joi.string().optional()
        : joi.string().required().messages({
            "string.base": "Password must be a string",
            "string.empty": "Password is required",
          }),
    dateOfBirth:
      regType === "Google"
        ? joi.date().optional()
        : joi.date().required().max("now").messages({
            "date.base": "Date of birth must be a valid date",
            "date.empty": "Date of birth is required",
            "date.max": "Date of birth cannot be in the future",
          }),
    gender:
      regType === "Google"
        ? joi.string().valid("Male", "Female", "Non-Binary", "Other").optional()
        : joi
            .string()
            .valid("Male", "Female", "Non-Binary", "Other")
            .required()
            .messages({
              "string.base": "Gender must be a string",
              "any.only":
                "Gender must be one of ['Male', 'Female', 'Non-Binary', 'Other']",
              "string.empty": "Gender is required",
            }),
  });

  
};

//user registration

const userRegiser = async (req, res) => {
  const { username, email, password, dateOfBirth, gender } = req.body;
  console.log(req.body);

  // const validate = await userValidation.validate({
  //   username,
  //   email,
  //   password,
  //   dateOfBirth,
  //   gender,
  // });

  // if (!validate) {
  //   res.status(400).send("Validation error");
  // }

  if (!(username && email && password && dateOfBirth && gender)) {
    res.status(400).json({
      message: "Please fill all field",    
    });
  }
  const userExist = await userSchema.findOne({ email });

  if (userExist) {
    res.status(401).send("User already exist ");
  }

  //password bcrypt
  const hashPassword = await bcrypt.hash(String(password), 10);

  const user = await userSchema.create({
    username,
    email,
    password: hashPassword,
    dateOfBirth,
    gender,
  });
  //generate token

  const token = jwt.sign({ id: user._id }, process.env.jwt_secret, {
    expiresIn: "2h",
  });
  // user.token = token;
  res.cookie("token", token);

  user.password = undefined;
  res.status(200).json({
    success: true,
    message: "Account created successfully",  
  });    
};

//User  Login
const userLogin = async (req, res) => {
  const { email, username, password } = req.body;

  if (!(email || username) || !password) {
    res.status(400).send("Please fill all fields");
  }

  const userData = await userSchema.findOne({
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
  const token = jwt.sign({ id: userData._id }, process.env.jwt_secret, {
    expiresIn: "2h",
  });
  res.cookie("token", token);
  res.status(200).json({
    userData,
    token,
    message: "Login successfull",
  });
};
//google

const googleLogin = async (req, res) => {
  const { token } = req.body;
  console.log(token);
  const response = await fetch(
    `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`
  );
  const googleData = await response.json();
  console.log(googleData);
  const { email, name } = googleData;
  let user = await userSchema.findOne({ email });
  if (!user) {
    user = new userSchema({
      username: name,
      email,
      loginMethod: "Google",
    });
    await user.save();
  }
  const jwt_token = jwt.sign({ id: user._id }, process.env.jwt_secret, {
    expiresIn: "2h",
  });

  res.cookie("token", jwt_token);
  res.status(200).json({
    userData: user,
    token: jwt_token,
    message: "Login successfull",
  });
};

//forgot password

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await userSchema.findOne({ email });

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
    http://localhost:3000/reset-password/${token}\n\n
    If you did not request this, please ignore this email and your password will remain unchanged.\n`,
  };

  await transporter.sendMail(mailOptions);

  res.status(200).send("Reset link sent to your email");
};

//password save

const passwordSave = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await userSchema.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if(!user){
    res.status(400).send("Password reset token is invalid ")
  }
  user.password = bcrypt.hashSync(password, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        res.status(200).send("Password has been reset")
};

module.exports = { userRegiser, userLogin, googleLogin,forgotPassword,passwordSave };
