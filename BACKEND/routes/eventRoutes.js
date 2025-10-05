const express = require('express');
const { registerForEvent, getRegistrations } = require('../controllers/eventController');
const auth = require('../middleware/auth');
const upload = require('../middleware/multerConfig');

const router = express.Router();

router.post('/register', auth, upload.single('clg_id'), registerForEvent);
router.get('/registrations', auth, getRegistrations);

module.exports = router;