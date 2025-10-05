const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    admin.otp = otp;
    admin.otpExpiry = otpExpiry;
    await admin.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Admin OTP for Login',
      text: `Your OTP is ${otp}. It expires in 10 minutes.`
    });

    res.json({ msg: 'OTP sent to email', email });
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

const adminVerifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ msg: 'Admin not found' });
    }
    if (admin.otp !== otp || admin.otpExpiry < Date.now()) {
      return res.status(400).json({ msg: 'Invalid or expired OTP' });
    }

    admin.otp = undefined;
    admin.otpExpiry = undefined;
    await admin.save();

    const token = jwt.sign({ id: admin._id, email: admin.email, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send login alert
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Admin Login Alert',
      text: 'You have successfully logged in to the admin dashboard.'
    });

    res.json({ token, admin: { id: admin._id, name: admin.name, email: admin.email, mobile: admin.mobile, role: admin.role } });
  } catch (err) {
    console.error('Admin verify OTP error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

const getAdminData = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select('-password -otp -otpExpiry');
    if (!admin || admin.role !== 'admin') {
      return res.status(404).json({ msg: 'Admin not found' });
    }
    res.json(admin);
  } catch (err) {
    console.error('Get admin data error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = { adminLogin, adminVerifyOTP, getAdminData };