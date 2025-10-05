const User = require('../models/User');
const Registration = require('../models/Registration');
const nodemailer = require('nodemailer');
const ExcelJS = require('exceljs');
const { getModel, events } = require('../models/Event');

const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    let totalRegistrations = 0;
    let totalCanceled = 0;

    for (const eventName of events) {
      const EventModel = getModel(eventName);
      const eventCount = await EventModel.countDocuments({ isCanceled: false });
      const eventCanceled = await EventModel.countDocuments({ isCanceled: true });
      totalRegistrations += eventCount;
      totalCanceled += eventCanceled;
    }

    res.json({ totalUsers, totalRegistrations, totalCanceled });
  } catch (err) {
    console.error('Analytics error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

const getAllRegistrations = async (req, res) => {
  try {
    let allRegs = [];
    for (const eventName of events) {
      const EventModel = getModel(eventName);
      const eventRegs = await EventModel.find().lean();
      eventRegs.forEach(reg => {
        reg.user = { email: reg.email };
        reg._id = reg.registrationId;
        allRegs.push(reg);
      });
    }
    allRegs.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    res.json(allRegs);
  } catch (err) {
    console.error('Get registrations error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('name email mobile isVerified');
    res.json(users);
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

const getOverallRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find().populate('user', 'name email mobile');
    res.json(registrations);
  } catch (err) {
    console.error('Get overall registrations error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

const updateRegistration = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  try {
    const reg = await Registration.findById(id);
    if (!reg) return res.status(404).json({ msg: 'Registration not found' });

    const EventModel = getModel(reg.event);
    const eventReg = await EventModel.findOneAndUpdate(
      { registrationId: id },
      { ...updateData, event: reg.event },
      { new: true }
    );

    if (!eventReg) return res.status(404).json({ msg: 'Event registration not found' });

    await Registration.findByIdAndUpdate(id, updateData);
    res.json({ ...eventReg, _id: id, user: { email: eventReg.email } });
  } catch (err) {
    console.error('Update registration error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

const cancelRegistration = async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;
  try {
    const reg = await Registration.findById(id).populate('user', 'email');
    if (!reg) return res.status(404).json({ msg: 'Registration not found' });

    const EventModel = getModel(reg.event);
    await EventModel.findOneAndUpdate(
      { registrationId: id },
      { isCanceled: true, cancelReason: reason }
    );

    reg.isCanceled = true;
    reg.cancelReason = reason;
    await reg.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: reg.user.email,
      subject: 'Registration Canceled',
      text: `Your registration for ${reg.event} has been canceled. Reason: ${reason}`
    });

    res.json({ msg: 'Registration canceled' });
  } catch (err) {
    console.error('Cancel registration error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

const exportData = async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();

    // Users sheet
    const usersSheet = workbook.addWorksheet('Users');
    usersSheet.addRow(['Name', 'Email', 'Mobile', 'Verified']);
    const users = await User.find().select('name email mobile isVerified');
    users.forEach(user => {
      usersSheet.addRow([user.name, user.email, user.mobile, user.isVerified ? 'Yes' : 'No']);
    });

    // Overall Registrations sheet
    const overallSheet = workbook.addWorksheet('Overall Registrations');
    overallSheet.addRow(['Event', 'Team Name', 'Category', 'College', 'Team Size', 'Status']);
    const registrations = await Registration.find().populate('user', 'email');
    registrations.forEach(reg => {
      overallSheet.addRow([
        reg.event.replace(/-/g, ' '),
        reg.teamName,
        reg.category || 'N/A',
        reg.college || 'N/A',
        reg.teamSize,
        reg.isCanceled ? 'Canceled' : 'Active'
      ]);
    });

    // Event-Specific Registrations
    for (const eventName of events) {
      const EventModel = getModel(eventName);
      const eventRegs = await EventModel.find().lean();
      const eventSheet = workbook.addWorksheet(eventName.replace(/-/g, ' '));
      eventSheet.addRow([
        'Team Name', 'Leader Name', 'Email', 'Mobile', 'College', 'Course', 'Branch', 'Year',
        'Roll No', 'Gender', 'Team Size', 'Members', 'Status'
      ]);
      eventRegs.forEach(reg => {
        eventSheet.addRow([
          reg.teamName,
          reg.teamLeaderName,
          reg.email,
          reg.mobile,
          reg.college,
          reg.course,
          reg.branch || 'N/A',
          reg.year,
          reg.rollno,
          reg.gender,
          reg.teamSize,
          reg.teamMembers?.map(m => `${m.name} (${m.email})`).join(', ') || 'N/A',
          reg.isCanceled ? 'Canceled' : 'Active'
        ]);
      });
    }

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=full_data.xlsx');
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error('Export error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = { getAnalytics, getAllRegistrations, updateRegistration, cancelRegistration, exportData, getUsers, getOverallRegistrations };