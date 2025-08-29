const nodemailer = require("nodemailer");
const { otpMailTemplate } = require("../../public/template/email/otp");
const { orderPlacedTemplate } = require("../../public/template/email/orderPlaced")
const axios = require('axios');


module.exports = {
    sendOtp: async (to, name, otpValue) => {
        try {
            const response = await axios.post("https://api.brevo.com/v3/smtp/email",
                {
                    sender: { email: process.env.BREVO_USER, name: "FeedMore" },
                    to: [{ email: to }],
                    subject: "OTP Verification",
                    htmlContent: otpMailTemplate(name, otpValue),
                },
                {
                    headers: {
                        "api-key": process.env.BREVO_API_KEY,
                        "Content-Type": "application/json",
                    },
                }
            );
        } catch (e) {
            console.error("Brevo API error:", e.response?.data || e.message);
            return false;
        }
    },

    orderPlacedSuccess: async (to, name, order_id, order_date) => {
        try {
            const response = await axios.post("https://api.brevo.com/v3/smtp/email",
                {
                    sender: { email: process.env.BREVO_USER, name: "FeedMore" },
                    to: [{ email: to }],
                    subject: "Order Placed Successfully",
                    htmlContent: orderPlacedTemplate(name, order_id, order_date),
                },
                {
                    headers: {
                        "api-key": process.env.BREVO_API_KEY,
                        "Content-Type": "application/json",
                    },
                }
            );
            return true;
        } catch (error) {
            console.error("Brevo API error:", error.response?.data || error.message);
            return false;
        }
    }
};