// const Registration = require('../models/Registration');
// const User = require('../models/User');
// const { getModel } = require('../models/Event');
// const cloudinary = require('cloudinary').v2;
// const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
// });

// const generateEmailHtml = (data, isLeader = true, member = null) => {
//   const { registrationId, event, teamName, teamLeaderName, email, mobile, college, year, teamSize, rollno, gender, members, category, course, branch } = data;

//   let content = '';

//   if (isLeader) {
//     let membersTable = '';
//     if (teamSize > 0) {
//       let membersRows = members.map((m, i) => `
//         <tr>
//           <td style="border: 1px solid #ddd; padding: 8px;">${m.name}</td>
//           <td style="border: 1px solid #ddd; padding: 8px;">${m.email}</td>
//           <td style="border: 1px solid #ddd; padding: 8px;">${m.course}</td>
//           <td style="border: 1px solid #ddd; padding: 8px;">${m.branch}</td>
//           <td style="border: 1px solid #ddd; padding: 8px;">${m.year}</td>
//           <td style="border: 1px solid #ddd; padding: 8px;">${m.rollno}</td>
//         </tr>
//       `).join('');

//       membersTable = `
//         <h3>Team Members</h3>
//         <table style="width: 100%; border-collapse: collapse;">
//           <thead><tr>
//             <th style="border: 1px solid #ddd; padding: 8px; background: #4A90E2; color: white;">Name</th>
//             <th style="border: 1px solid #ddd; padding: 8px; background: #4A90E2; color: white;">Email</th>
//             <th style="border: 1px solid #ddd; padding: 8px; background: #4A90E2; color: white;">Course</th>
//             <th style="border: 1px solid #ddd; padding: 8px; background: #4A90E2; color: white;">Branch</th>
//             <th style="border: 1px solid #ddd; padding: 8px; background: #4A90E2; color: white;">Year</th>
//             <th style="border: 1px solid #ddd; padding: 8px; background: #4A90E2; color: white;">Roll No</th>
//           </tr></thead>
//           <tbody>${membersRows}</tbody>
//         </table>
//       `;
//     }

//     content = `
//       <p>Dear ${teamLeaderName},</p>
//       <p>We're excited to inform you that you have successfully registered as the team leader for the HIET Ghaziabad Tech Event. Your registration details are provided below for your reference.</p>
//       <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
//         <tr><th style="border: 1px solid #ddd; padding: 8px; background: #4A90E2; color: white;">Field</th><th style="border: 1px solid #ddd; padding: 8px; background: #4A90E2; color: white;">Details</th></tr>
//         <tr><td>Registration ID</td><td>${registrationId}</td></tr>
//         <tr><td>Event</td><td>${event.replace(/-/g, ' ')}</td></tr>
//         <tr><td>Team Name</td><td>${teamName}</td></tr>
//         <tr><td>Team Leader</td><td>${teamLeaderName}</td></tr>
//         <tr><td>Email</td><td>${email}</td></tr>
//         <tr><td>Mobile</td><td>${mobile}</td></tr>
//         <tr><td>College</td><td>${college}</td></tr>
//         <tr><td>Year</td><td>${year}</td></tr>
//         <tr><td>Team Size (Excluding Leader)</td><td>${teamSize}</td></tr>
//       </table>
//       ${membersTable}
//     `;
//   } else {
//     content = `
//       <p>Hello ${member.name},</p>
//       <p>We're excited to confirm that you have successfully registered as a team member for the HIET Ghaziabad Tech Event in the team '${teamName}' led by ${teamLeaderName}. Your registration details are provided below for your reference.</p>
//       <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
//         <tr><th style="border: 1px solid #ddd; padding: 8px; background: #4A90E2; color: white;">Field</th><th style="border: 1px solid #ddd; padding: 8px; background: #4A90E2; color: white;">Details</th></tr>
//         <tr><td>Registration ID</td><td>${registrationId}</td></tr>
//         <tr><td>Event</td><td>${event.replace(/-/g, ' ')}</td></tr>
//         <tr><td>Team Name</td><td>${teamName}</td></tr>
//         <tr><td>Team Leader</td><td>${teamLeaderName}</td></tr>
//         <tr><td>Your Name</td><td>${member.name}</td></tr>
//         <tr><td>Your Email</td><td>${member.email}</td></tr>
//         <tr><td>Your Course</td><td>${member.course}</td></tr>
//         <tr><td>Your Branch</td><td>${member.branch}</td></tr>
//         <tr><td>Your Year</td><td>${member.year}</td></tr>
//         <tr><td>Your Roll No</td><td>${member.rollno}</td></tr>
//         <tr><td>Team Size (Excluding Leader)</td><td>${teamSize}</td></tr>
//       </table>
//     `;
//   }

//   return `
//     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd;">
//       <h2 style="color: #4A90E2; text-align: center;">Registration Confirmation</h2>
//       ${content}
//       <h3>Event Rules</h3>
//       <ul>
//         <li>Arrive 15 minutes before the event starts.</li>
//         <li>No late entries allowed.</li>
//         <li>Bring valid ID for verification.</li>
//         <li>Follow the specified dress code.</li>
//         <li>Respect all participants and organizers.</li>
//       </ul>
//       <p style="text-align: center;">Best regards,<br>The Event Team<br>HIET Ghaziabad</p>
//     </div>
//   `;
// };

// const registerForEvent = async (req, res) => {
//   const { event, teamName, category, schoolClass, course, teamSize, rollno, gender, college, year, branch, members } = req.body;
//   const leaderEmail = req.user.email;

//   try {
//     const leader = await User.findOne({ email: leaderEmail });
//     if (!leader) return res.status(404).json({ msg: 'User not found' });

//     if (!/^[6-9]\d{9}$/.test(leader.mobile)) return res.status(400).json({ msg: 'Invalid mobile' });

//     const allowedColleges = [
//       'ABESIT, Ghaziabad', 'IMS Engineering College, Ghaziabad', 'ABES Engineering College, Ghaziabad',
//       'AKGEC, Ghaziabad', 'JSS Noida', 'RKGIT, Ghaziabad', 'GL Bajaj, Noida',
//       'HI-TECH Institute of Engineering and Technology, Ghaziabad', 'NIET', 'GNIOT',
//       'Galgotias University', 'Galgotias College', 'KIET', 'Bhagwati Institute of Technology',
//       'H.R. Group of Institutions', 'INMANTEC Institutions', 'Delhi Public School (DPS), Ghaziabad',
//       'Kendriya Vidyalaya, Ghaziabad', 'OTHER'
//     ];
//     if (!allowedColleges.includes(college)) return res.status(400).json({ msg: 'Invalid college' });

//     let clg_id = '';
//     if (req.file) {
//       const result = await new Promise((resolve, reject) => {
//         const uploadStream = cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
//           if (error) reject(error);
//           else resolve(result);
//         });
//         uploadStream.end(req.file.buffer);
//       });
//       clg_id = result.secure_url;
//     } else {
//       return res.status(400).json({ msg: 'College ID required' });
//     }

//     const parsedMembers = members ? JSON.parse(members) : [];
//     const leaderYear = parseInt(category === 'school student' ? schoolClass : year);
//     const leaderBranch = category === 'college student' ? branch : '';
//     const leaderCourse = category === 'college student' ? course : 'School';

//     const newReg = new Registration({
//       user: leader._id,
//       event,
//       teamName,
//       category,
//       schoolClass: category === 'school student' ? schoolClass : undefined,
//       course: leaderCourse,
//       branch: leaderBranch,
//       year: leaderYear,
//       teamSize: parseInt(teamSize),
//       rollno,
//       gender,
//       college,
//       clg_id,
//       members: parsedMembers
//     });

//     await Promise.all([newReg.save(), leader.updateOne({ $push: { registrations: newReg._id } })]);

//     const EventModel = getModel(event);
//     const eventReg = new EventModel({
//       clg_id,
//       registrationId: newReg._id.toString(),
//       event,
//       teamName,
//       teamLeaderName: leader.name,
//       email: leader.email,
//       mobile: leader.mobile,
//       gender,
//       college,
//       course: leaderCourse,
//       branch: leaderBranch,
//       year: leaderYear,
//       rollno,
//       teamSize: parseInt(teamSize),
//       teamMembers: parsedMembers
//     });
//     await eventReg.save();

//     const emailData = {
//       registrationId: newReg._id.toString(),
//       event,
//       teamName,
//       teamLeaderName: leader.name,
//       email: leader.email,
//       mobile: leader.mobile,
//       college,
//       year: leaderYear,
//       teamSize: parseInt(teamSize),
//       rollno,
//       gender,
//       members: parsedMembers,
//       category,
//       course: leaderCourse,
//       branch: leaderBranch
//     };

//     transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to: leader.email,
//       subject: `Registration Confirmed for ${event.replace(/-/g, ' ')} - Crossroad 2025`,
//       html: generateEmailHtml(emailData, true)
//     }).catch(console.error);

//     if (parsedMembers.length > 0) {
//       parsedMembers.forEach(member => {
//         transporter.sendMail({
//           from: process.env.EMAIL_USER,
//           to: member.email,
//           subject: `You're Registered for ${event.replace(/-/g, ' ')} - Crossroad 2025`,
//           html: generateEmailHtml(emailData, false, member)
//         }).catch(console.error);
//       });
//     }

//     res.json({ msg: 'Registration successful', regId: newReg._id });
//   } catch (err) {
//     console.error('Registration error:', err);
//     res.status(500).json({ msg: 'Server error', error: err.message });
//   }
// };

// const getRegistrations = async (req, res) => {
//   try {
//     const regs = await Registration.find({ user: req.user.id });
//     res.json(regs);
//   } catch (err) {
//     console.error('Fetch registrations error:', err);
//     res.status(500).json({ msg: 'Server error', error: err.message });
//   }
// };

// module.exports = { registerForEvent, getRegistrations };
// new
const Registration = require('../models/Registration');
const User = require('../models/User');
const { getModel } = require('../models/Event');
const cloudinary = require('cloudinary').v2;
const nodemailer = require('nodemailer');

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

const generateEmailHtml = (data, isLeader = true, member = null) => {
  const { registrationId, event, teamName, teamLeaderName, email, mobile, college, year, teamSize, rollno, gender, members, category, course, branch } = data;

  let content = '';

  if (isLeader) {
    let membersTable = '';
    if (teamSize > 0) {
      let membersRows = members.map((m, i) => `
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;">${m.name}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${m.email}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${m.course}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${m.branch}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${m.year}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${m.rollno}</td>
        </tr>
      `).join('');

      membersTable = `
        <h3>Team Members</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead><tr>
            <th style="border: 1px solid #ddd; padding: 8px; background: #4A90E2; color: white;">Name</th>
            <th style="border: 1px solid #ddd; padding: 8px; background: #4A90E2; color: white;">Email</th>
            <th style="border: 1px solid #ddd; padding: 8px; background: #4A90E2; color: white;">Course</th>
            <th style="border: 1px solid #ddd; padding: 8px; background: #4A90E2; color: white;">Branch</th>
            <th style="border: 1px solid #ddd; padding: 8px; background: #4A90E2; color: white;">Year</th>
            <th style="border: 1px solid #ddd; padding: 8px; background: #4A90E2; color: white;">Roll No</th>
          </tr></thead>
          <tbody>${membersRows}</tbody>
        </table>
      `;
    }

    content = `
      <p>Dear ${teamLeaderName},</p>
      <p>We're excited to inform you that you have successfully registered as the team leader for the HIET Ghaziabad Tech Event. Your registration details are provided below for your reference.</p>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr><th style="border: 1px solid #ddd; padding: 8px; background: #4A90E2; color: white;">Field</th><th style="border: 1px solid #ddd; padding: 8px; background: #4A90E2; color: white;">Details</th></tr>
        <tr><td>Registration ID</td><td>${registrationId}</td></tr>
        <tr><td>Event</td><td>${event.replace(/-/g, ' ')}</td></tr>
        <tr><td>Team Name</td><td>${teamName}</td></tr>
        <tr><td>Team Leader</td><td>${teamLeaderName}</td></tr>
        <tr><td>Email</td><td>${email}</td></tr>
        <tr><td>Mobile</td><td>${mobile}</td></tr>
        <tr><td>College</td><td>${college}</td></tr>
        <tr><td>Year</td><td>${year}</td></tr>
        <tr><td>Team Size (Excluding Leader)</td><td>${teamSize}</td></tr>
      </table>
      ${membersTable}
    `;
  } else {
    content = `
      <p>Hello ${member.name},</p>
      <p>We're excited to confirm that you have successfully registered as a team member for the HIET Ghaziabad Tech Event in the team '${teamName}' led by ${teamLeaderName}. Your registration details are provided below for your reference.</p>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr><th style="border: 1px solid #ddd; padding: 8px; background: #4A90E2; color: white;">Field</th><th style="border: 1px solid #ddd; padding: 8px; background: #4A90E2; color: white;">Details</th></tr>
        <tr><td>Registration ID</td><td>${registrationId}</td></tr>
        <tr><td>Event</td><td>${event.replace(/-/g, ' ')}</td></tr>
        <tr><td>Team Name</td><td>${teamName}</td></tr>
        <tr><td>Team Leader</td><td>${teamLeaderName}</td></tr>
        <tr><td>Your Name</td><td>${member.name}</td></tr>
        <tr><td>Your Email</td><td>${member.email}</td></tr>
        <tr><td>Your Course</td><td>${member.course}</td></tr>
        <tr><td>Your Branch</td><td>${member.branch}</td></tr>
        <tr><td>Your Year</td><td>${member.year}</td></tr>
        <tr><td>Your Roll No</td><td>${member.rollno}</td></tr>
        <tr><td>Team Size (Excluding Leader)</td><td>${teamSize}</td></tr>
      </table>
    `;
  }

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd;">
      <h2 style="color: #4A90E2; text-align: center;">Registration Confirmation</h2>
      ${content}
      <h3>Event Rules</h3>
      <ul>
        <li>Arrive 15 minutes before the event starts.</li>
        <li>No late entries allowed.</li>
        <li>Bring valid ID for verification.</li>
        <li>Follow the specified dress code.</li>
        <li>Respect all participants and organizers.</li>
      </ul>
      <p style="text-align: center;">Best regards,<br>The Event Team<br>HIET Ghaziabad</p>
    </div>
  `;
};

const registerForEvent = async (req, res) => {
  const { event, teamName, category, schoolClass, course, teamSize, rollno, gender, college, year, branch, members } = req.body;
  const leaderEmail = req.user.email;

  try {
    const leader = await User.findOne({ email: leaderEmail });
    if (!leader) return res.status(404).json({ msg: 'User not found' });

    if (!/^[6-9]\d{9}$/.test(leader.mobile)) return res.status(400).json({ msg: 'Invalid mobile' });

    const allowedColleges = [
      'ABESIT, Ghaziabad', 'IMS Engineering College, Ghaziabad', 'ABES Engineering College, Ghaziabad',
      'AKGEC, Ghaziabad', 'JSS Noida', 'RKGIT, Ghaziabad', 'GL Bajaj, Noida',
      'HI-TECH Institute of Engineering and Technology, Ghaziabad', 'NIET', 'GNIOT',
      'Galgotias University', 'Galgotias College', 'KIET', 'Bhagwati Institute of Technology',
      'H.R. Group of Institutions', 'INMANTEC Institutions', 'Delhi Public School (DPS), Ghaziabad',
      'Kendriya Vidyalaya, Ghaziabad', 'OTHER'
    ];
    if (!allowedColleges.includes(college)) return res.status(400).json({ msg: 'Invalid college' });

    let clg_id = '';
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        });
        uploadStream.end(req.file.buffer);
      });
      clg_id = result.secure_url;
    } else {
      return res.status(400).json({ msg: 'College ID required' });
    }

    const parsedMembers = members ? JSON.parse(members) : [];
    const leaderYear = parseInt(category === 'school student' ? schoolClass : year);
    const leaderBranch = category === 'college student' ? branch : '';
    const leaderCourse = category === 'college student' ? course : 'School';

    const newReg = new Registration({
      user: leader._id,
      event,
      teamName,
      category,
      schoolClass: category === 'school student' ? schoolClass : undefined,
      course: leaderCourse,
      branch: leaderBranch,
      year: leaderYear,
      teamSize: parseInt(teamSize),
      rollno,
      gender,
      college,
      clg_id,
      members: parsedMembers
    });

    await Promise.all([newReg.save(), leader.updateOne({ $push: { registrations: newReg._id } })]);

    const EventModel = getModel(event);
    const eventReg = new EventModel({
      clg_id,
      registrationId: newReg._id.toString(),
      event,
      teamName,
      teamLeaderName: leader.name,
      email: leader.email,
      mobile: leader.mobile,
      gender,
      college,
      course: leaderCourse,
      branch: leaderBranch,
      year: leaderYear,
      rollno,
      teamSize: parseInt(teamSize),
      teamMembers: parsedMembers
    });
    await eventReg.save();

    const emailData = {
      registrationId: newReg._id.toString(),
      event,
      teamName,
      teamLeaderName: leader.name,
      email: leader.email,
      mobile: leader.mobile,
      college,
      year: leaderYear,
      teamSize: parseInt(teamSize),
      rollno,
      gender,
      members: parsedMembers,
      category,
      course: leaderCourse,
      branch: leaderBranch
    };

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: leader.email,
        subject: `Registration Confirmed for ${event.replace(/-/g, ' ')} - Crossroad 2025`,
        html: generateEmailHtml(emailData, true)
      });
      console.log(`Confirmation email sent to leader: ${leader.email}`);
    } catch (emailErr) {
      console.error('Nodemailer error for leader email:', emailErr);
    }

    if (parsedMembers.length > 0) {
      const emailPromises = parsedMembers.map(member => {
        return transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: member.email,
          subject: `You're Registered for ${event.replace(/-/g, ' ')} - Crossroad 2025`,
          html: generateEmailHtml(emailData, false, member)
        }).catch(err => {
          console.error(`Nodemailer error for member email ${member.email}:`, err);
        });
      });
      await Promise.all(emailPromises);
    }

    res.json({ msg: 'Registration successful', regId: newReg._id });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

const getRegistrations = async (req, res) => {
  try {
    const regs = await Registration.find({ user: req.user.id });
    res.json(regs);
  } catch (err) {
    console.error('Fetch registrations error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

module.exports = { registerForEvent, getRegistrations };