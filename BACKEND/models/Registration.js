const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: String, required: true },
  teamName: { type: String, required: true },
  category: { type: String, required: true },
  schoolClass: { type: String },
  course: { type: String },
  branch: { type: String },
  year: { type: Number, required: true, min: 1, max: 12 },
  teamSize: { type: Number, required: true, min: 0, max: 10 },
  rollno: { type: String, required: true },
  gender: { type: String, required: true },
  college: { type: String, required: true },
  clg_id: { type: String, required: true },
  members: [{
    name: { type: String, required: true },
    email: { type: String, required: true },
    course: { type: String, required: true },
    branch: { type: String, required: true },
    year: { type: Number, required: true },
    rollno: { type: String, required: true }
  }],
  isCanceled: { type: Boolean, default: false },
  cancelReason: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Registration', registrationSchema);