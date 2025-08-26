const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerEmail: { type: String, required: true },
    foodOrderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    status: { type: String, enum: ['PAID', 'ACTIVE', 'TERMINATED', 'INITIATE', 'NOT_PAID'], default: 'NOT_PAID' },
    orderId: { type: String, required: true, unique: true },
    date: { type: String, required: true },
});

module.exports = mongoose.model('Transaction', transactionSchema);