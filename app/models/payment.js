const mongoose = require('mongoose');


const paymentSchema = new mongoose.Schema({
    billingMonth: { type: String, required: true },
    totalOrderAmount: { type: Number, required: true, default: 0 },
    commissionAmount: { type: Number, required: true, default: 0 },
    paid: { type: Boolean, default: false },
    status: { type: String, enum: ['PAID', 'ACTIVE', 'TERMINATED','INITIATE','NOT_PAID'], default: 'NOT_PAID' },
}, { timestamps: true })


module.exports = mongoose.model('Payment', paymentSchema);