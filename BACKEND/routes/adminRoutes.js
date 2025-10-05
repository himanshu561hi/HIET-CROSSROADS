const express = require('express');
const { adminLogin, adminVerifyOTP, getAdminData } = require('../controllers/adminAuthController');
const { getAnalytics, getAllRegistrations, updateRegistration, cancelRegistration, exportData, getUsers, getOverallRegistrations } = require('../controllers/adminController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/login', adminLogin);
router.post('/verify-otp', adminVerifyOTP);
router.get('/data', auth, getAdminData);
router.get('/analytics', auth, getAnalytics);
router.get('/registrations', auth, getAllRegistrations);
router.put('/registrations/:id', auth, updateRegistration);
router.post('/registrations/:id/cancel', auth, cancelRegistration);
router.get('/export', auth, exportData);
router.get('/users', auth, getUsers);  // New endpoint
router.get('/overall-registrations', auth, getOverallRegistrations);  // New endpoint

module.exports = router;