const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    phone: { 
        type: String, 
        required: true, 
        unique: true, 
    },
    name: { type: String, required: true, maxlength:32 },
    birth_date: { type: Number },
    gender: { type: Number, enum:[0,1] },
    profile: { type: String },
    is_verified: { type: Boolean, required: true, default:false },
    password: { type: String, required: true },
    temp: {type: String, required: false, default:null},
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('users', userSchema);