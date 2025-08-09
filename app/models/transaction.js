const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    foodOrderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['PENDING', 'COMPLETED', 'FAILED'], default: 'PENDING' },
    merchantOrderId: { type: String, required: true, unique: true },
    phonepeOrderId: { type: String, required: true },
    transactionId: { type: String },
    paymentMode:{ type: String },
    date: { type: String, required: true },
});

module.exports = mongoose.model('Transaction', transactionSchema);