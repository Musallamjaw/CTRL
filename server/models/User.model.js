const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: {type: Number, required: true},
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    avatar: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
