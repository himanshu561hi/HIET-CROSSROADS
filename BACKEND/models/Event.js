const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
    "clg_id": {
        type: String,
        required: true
    },
    "registrationId": {
        type: String,
        required: true
    },
    "event": {
        type: String,
        required: true
    },
    "teamName": {
        type: String,
        required: true,
        index: true
    },
    "teamLeaderName": {
        type: String,
        required: true
    },
    "email": {
        type: String,
        required: true,
        index: true,
        match: /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/
    },
    "mobile": {
        type: String,
        required: true,
        index: true,
        match: /^[6-9][0-9]{9}$/
    },
    "gender": {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true
    },
    "college": {
        type: String,
        required: true,
        index: true
    },
    "course": {
        type: String,
        required: true
    },
    "branch": {
        type: String,
        required: false
    },
    "year": {
        type: Number,
        required: true,
        min: [1, 'Year must be at least 1'],
        max: [12, 'Year cannot exceed 12']
    },
    "rollno": {
        type: String,
        required: true,
        index: true
    },
    "teamSize": {
        type: Number,
        required: true,
        min: [0, 'Team size must be at least 0'],
        max: [10, 'Team size cannot exceed 10']
    },
    "teamMembers": [{
        name: { type: String, required: true },
        email: { type: String, required: true, match: /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/ },
        course: { type: String, required: true },
        branch: { type: String, required: true },
        year: { type: Number, required: true, min: [1, 'Year must be at least 1'], max: [12, 'Year cannot exceed 12'] },
        rollno: { type: String, required: true }
    }],
    isCanceled: { type: Boolean, default: false },  // New field
    cancelReason: { type: String }  // New field
}, { timestamps: true });

const events = [
    'code-puzzle',
    'project-exhibition',
    'robo-race',
    'cultural-events',
    'rangoli-competition',
    'food-without-fire',
    'nukkad-natak',
    'singing',
    'technical-poster',
    'dance-competition',
    'rock-band',
    'short-film-maker',
    'ad-mad-show',
    'tresure-hunt'
];

const getModel = (event) => {
    if (!events.includes(event)) {
        throw new Error('Invalid event');
    }
    return mongoose.model(event.replace(/-/g, '_'), EventSchema, event.replace(/-/g, '_'));
};

module.exports = { getModel, events, EventSchema };