const mongoose = require("mongoose");
const User = require("../../models/user");
const Order = require("../../models/orders");
require('dotenv').config({ path: '../../../.env' })


//MongoDB connection
const URL = process.env.MONGODB_CONNECTION_URL

mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("MongoDB connected successfully.");
}).catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
});

// This script migrates user phone numbers from orders to the user collection
async function migrateUserPhoneNumbers() {
    const users = await User.find().lean();

    for (const user of users) {
        // Find all orders made by this customer
        const orders = await Order.find({ customerId: user._id, phone: { $exists: true } }).lean();

        // Extract unique phone numbers
        const phoneSet = new Set();
        for (const order of orders) {
            if (order.phone) {
                phoneSet.add(Number(order.phone));
            }
        }

        const phoneArray = Array.from(phoneSet);

        if (phoneArray.length > 0) {
            await User.updateOne({ _id: user._id }, { $set: { phone: phoneArray } });
            console.log(`✅ Updated user ${user.name} (${user._id}) with phones: ${phoneArray.join(", ")}`);
        }
    }

    console.log("📦 Migration completed.");
    mongoose.disconnect();
}


migrateUserPhoneNumbers();
