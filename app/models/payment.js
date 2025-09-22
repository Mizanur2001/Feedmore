const mongoose = require('mongoose');


const paymentSchema = new mongoose.Schema({
    transactionId: { type: String, required: true, unique: true },
    billingMonth: { type: String, required: true },
    totalOrderAmount: { type: Number, required: true, default: 0 },
    commissionAmount: { type: Number, required: true, default: 0 },
    paid: { type: Boolean, default: false },
    status: { type: String, enum: ['PAID', 'ACTIVE', 'TERMINATED', 'INITIATE', 'NOT_PAID'], default: 'NOT_PAID' },
}, { timestamps: true })

paymentSchema.pre('save', function (next) {
    if (this.isModified('totalOrderAmount') || this.isNew) {
        this.commissionAmount = this.totalOrderAmount * 0.03;
    }
    next();
});


module.exports = mongoose.model('Payment', paymentSchema);