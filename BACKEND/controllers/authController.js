// const User = require('../models/User');
// const jwt = require('jsonwebtoken');
// const nodemailer = require('nodemailer');
// require('dotenv').config();

// const generateOTP = () => {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// };

// const sendOTP = async (req, res) => {
//   const { email } = req.body;
//   const otp = generateOTP();
//   const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

//   try {
//     let user = await User.findOne({ email });
//     if (!user) {
//       console.log(`User not found for email: ${email}`);
//       return res.status(404).json({ msg: 'User not found' });
//     }

//     user.otp = otp;
//     user.otpExpiry = otpExpiry;
//     await user.save();

//     console.log('Sending OTP email with:');
//     console.log('EMAIL_USER:', process.env.EMAIL_USER);
//     console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Set' : 'Not set');

//     if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
//       console.error('Missing email credentials');
//       console.log(`Email sending failed, OTP for ${email}: ${otp}`);
//       return res.json({ msg: 'OTP resent, but email failed. OTP logged in console.', otp });
//     }

//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS
//       }
//     });

//     res.json({ msg: 'OTP resent' });

//     transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: 'Your OTP for Verification',
//       text: `Your OTP is ${otp}. It expires in 10 minutes.`
//     }).then(() => {
//       console.log(`OTP email sent to: ${email}`);
//     }).catch(emailErr => {
//       console.error('Nodemailer error in sendOTP:', emailErr);
//       console.log(`Email sending failed, OTP for ${email}: ${otp}`);
//     });
//   } catch (err) {
//     console.error('sendOTP error:', err);
//     res.status(500).json({ msg: 'Server error', error: err.message });
//   }
// };

// const verifyOTP = async (req, res) => {
//   const { email, otp } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       console.log(`User not found for email: ${email}`);
//       return res.status(404).json({ msg: 'User not found' });
//     }
//     if (user.otp !== otp || user.otpExpiry < Date.now()) {
//       console.log(`Invalid or expired OTP for email: ${email}`);
//       return res.status(400).json({ msg: 'Invalid or expired OTP' });
//     }

//     user.isVerified = true;
//     user.otp = undefined;
//     user.otpExpiry = undefined;
//     await user.save();

//     console.log(`OTP verified for email: ${email}`);
//     res.json({ msg: 'Email verified' });
//   } catch (err) {
//     console.error('verifyOTP error:', err);
//     res.status(500).json({ msg: 'Server error', error: err.message });
//   }
// };

// const register = async (req, res) => {
//   const { name, email, mobile, password } = req.body;

//   if (!/^[6-9]\d{9}$/.test(mobile)) {
//     console.log(`Invalid mobile number: ${mobile}`);
//     return res.status(400).json({ msg: 'Invalid Indian mobile number' });
//   }

//   try {
//     let user = await User.findOne({ email });
//     if (user) {
//       console.log(`User already exists: ${email}`);
//       return res.status(400).json({ msg: 'User already exists' });
//     }

//     user = new User({ name, email, mobile, password });
//     await user.save();
//     console.log(`User created: ${email}`);

//     const otp = generateOTP();
//     const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
//     user.otp = otp;
//     user.otpExpiry = otpExpiry;
//     await user.save();

//     console.log('Sending OTP email with:');
//     console.log('EMAIL_USER:', process.env.EMAIL_USER);
//     console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Set' : 'Not set');

//     if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
//       console.error('Missing email credentials');
//       console.log(`Email sending failed, OTP for ${email}: ${otp}`);
//       return res.json({ msg: 'User registered, email service misconfigured', email, otp });
//     }

//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS
//       }
//     });

//     res.json({ msg: 'User registered, OTP sent', email });

//     transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: 'Your OTP for Verification',
//       text: `Your OTP is ${otp}. It expires in 10 minutes.`
//     }).then(() => {
//       console.log(`OTP email sent to: ${email}`);
//     }).catch(emailErr => {
//       console.error('Nodemailer error in register:', emailErr);
//       console.log(`Email sending failed, OTP for ${email}: ${otp}`);
//     });
//   } catch (err) {
//     console.error('Register error:', err);
//     res.status(500).json({ msg: 'Server error', error: err.message });
//   }
// };

// const login = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       console.log(`User not found for login: ${email}`);
//       return res.status(400).json({ msg: 'Invalid credentials' });
//     }

//     const isMatch = await user.comparePassword(password);
//     if (!user.isVerified) {
//       console.log(`Email not verified for: ${email}`);
//       return res.status(400).json({ msg: 'Email not verified' });
//     }
//     if (!isMatch) {
//       console.log(`Invalid password for email: ${email}`);
//       return res.status(400).json({ msg: 'Invalid credentials' });
//     }

//     const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
//     console.log(`Login successful for: ${email}`);
//     res.json({ token, user: { id: user._id, name: user.name, email: user.email, mobile: user.mobile } });
//   } catch (err) {
//     console.error('Login error:', err);
//     res.status(500).json({ msg: 'Server error', error: err.message });
//   }
// };

// const getUserData = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select('-password -otp -otpExpiry');
//     if (!user) {
//       console.log(`User not found for ID: ${req.user.id}`);
//       return res.status(404).json({ msg: 'User not found' });
//     }
//     res.json(user);
//   } catch (err) {
//     console.error('getUserData error:', err);
//     res.status(500).json({ msg: 'Server error', error: err.message });
//   }
// };

// module.exports = { register, login, sendOTP, verifyOTP, getUserData };

// new
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTP = async (req, res) => {
  const { email } = req.body;
  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

  try {
    let user = await User.findOne({ email });
    if (!user) {
      console.log(`User not found for email: ${email}`);
      return res.status(404).json({ msg: 'User not found' });
    }

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    console.log('Sending OTP email with:');
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Set' : 'Not set');

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('Missing email credentials');
      console.log(`Email sending failed, OTP for ${email}: ${otp}`);
      return res.status(500).json({ msg: 'Email service misconfigured. OTP logged in console.', otp });
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // Use TLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      connectionTimeout: 10000, // 10 seconds timeout
      greetingTimeout: 10000,
      socketTimeout: 10000,
      logger: true, // Enable logging for debugging
      debug: true, // Show debug output
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP for Verification',
      text: `Your OTP is ${otp}. It expires in 10 minutes.`,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`OTP email sent to: ${email}`);
      res.json({ msg: 'OTP sent successfully' });
    } catch (emailErr) {
      console.error('Nodemailer error in sendOTP:', emailErr);
      console.log(`Email sending failed, OTP for ${email}: ${otp}`);
      return res.status(500).json({ msg: 'Failed to send OTP email. OTP logged in console.', otp });
    }
  } catch (err) {
    console.error('sendOTP error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`User not found for email: ${email}`);
      return res.status(404).json({ msg: 'User not found' });
    }
    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      console.log(`Invalid or expired OTP for email: ${email}`);
      return res.status(400).json({ msg: 'Invalid or expired OTP' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    console.log(`OTP verified for email: ${email}`);
    res.json({ msg: 'Email verified' });
  } catch (err) {
    console.error('verifyOTP error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

const register = async (req, res) => {
  const { name, email, mobile, password } = req.body;

  if (!/^[6-9]\d{9}$/.test(mobile)) {
    console.log(`Invalid mobile number: ${mobile}`);
    return res.status(400).json({ msg: 'Invalid Indian mobile number' });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      console.log(`User already exists: ${email}`);
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({ name, email, mobile, password });
    await user.save();
    console.log(`User created: ${email}`);

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    console.log('Sending OTP email with:');
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Set' : 'Not set');

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('Missing email credentials');
      console.log(`Email sending failed, OTP for ${email}: ${otp}`);
      return res.status(500).json({ msg: 'User registered, email service misconfigured', email, otp });
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // Use TLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
      logger: true,
      debug: true,
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP for Verification',
      text: `Your OTP is ${otp}. It expires in 10 minutes.`,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`OTP email sent to: ${email}`);
      res.json({ msg: 'User registered, OTP sent', email });
    } catch (emailErr) {
      console.error('Nodemailer error in register:', emailErr);
      console.log(`Email sending failed, OTP for ${email}: ${otp}`);
      res.status(500).json({ msg: 'User registered, failed to send OTP email', email, otp });
    }
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`User not found for login: ${email}`);
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!user.isVerified) {
      console.log(`Email not verified for: ${email}`);
      return res.status(400).json({ msg: 'Email not verified' });
    }
    if (!isMatch) {
      console.log(`Invalid password for email: ${email}`);
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log(`Login successful for: ${email}`);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, mobile: user.mobile } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

const getUserData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -otp -otpExpiry');
    if (!user) {
      console.log(`User not found for ID: ${req.user.id}`);
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('getUserData error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

module.exports = { register, login, sendOTP, verifyOTP, getUserData };