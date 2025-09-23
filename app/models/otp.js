const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
    {
        email: { type: String, trim: true, required: true },
        otp: { type: Number, require: true },
        createdAt: { type: Date, default: Date.now, expires: '15m' },
        type: { type: String, trim: true, enum: ["Registration", "forgetPass", "Login"], }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Otp', otpSchema)
