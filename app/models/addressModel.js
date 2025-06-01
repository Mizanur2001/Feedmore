const mongoose = require('mongoose');

const AddressInfoSchema = mongoose.Schema({
    phone: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String, required: false },
    city: { type: String, required: true },
    landmark: { type: String, required: true },
    postalCode: { type: String, required: true },
    state: { type: String, default: 'West Bengal' },
    country: { type: String, default: 'India' },
    addressType: { type: String, required: true },
}, { timestamps: true });

const addressSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    addressInfo: [AddressInfoSchema],
}, { timestamps: true });

const Address = mongoose.model("Address", addressSchema);
module.exports = Address;