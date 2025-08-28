const nodemailer = require("nodemailer");
const { otpMailTemplate } = require("../../public/template/email/otp");
const { orderPlacedTemplate } = require("../../public/template/email/orderPlaced")

const transpoter = nodemailer.createTransport({
    // service: 'gmail',
    host: "smtp.gmail.com",
    port: 465,            // use 465 for SSL
    secure: true,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});


module.exports = {
    sendOtp: async (to, name, otpValue) => {
        try {
            const option = {
                from: "FeedMore <" + process.env.GMAIL_USER + ">",
                to: to,
                subject: "OTP Verification",
                html: otpMailTemplate(name, otpValue),
            };
            const info = await transpoter.sendMail(option);
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    },

    orderPlacedSuccess: async (to, name, order_id, order_date) => {
        try {
            const option = {
                from: "FeedMore <" + process.env.GMAIL_USER + ">",
                to: to,
                subject: "Order Placed Successfully",
                html: orderPlacedTemplate(name, order_id, order_date),
            };
            const info = await transpoter.sendMail(option);
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    },
};