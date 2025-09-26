const User = require('../../models/user')
const OtpModel = require('../../models/otp')
const bcrypt = require('bcrypt');
const session = require('express-session');
const Mail = require("../../services/email");


function authController() {

    const _getUrl = () => {
        if (User.role == 'castomer') {
            return '/'
        }
        else {
            return '/admin/orders'
        }
    }

    return {
        login(req, res) {
            if (!req.session.user) {
                res.render("auth/login", {
                    title: 'Login - FeedMore',
                });
            }
            else {
                res.redirect('/')
            }
        },
        async postLogin(req, res) {
            try {
                const { email, password } = req.body

                if (email == '' || password == '') {
                    req.flash('error', 'All Field Requred')
                    req.flash('email', email)
                    return res.redirect('/login')
                }

                let user = await User.findOne({ email: email })

                if (user == null) {
                    req.flash('error', 'Invalid Email id')
                    req.flash('email', email)
                    return res.redirect('/login')
                }

                let compPass = await bcrypt.compare(password, user.password)
                if (!compPass) {
                    req.flash('error', 'Invalid Email or Password')
                    req.flash('email', email)
                    return res.redirect('/login')
                }

                req.session.user = { email: email, name: user.name, userId: user._id, role: user.role, phone: user?.phone };
                res.redirect(_getUrl())
            } catch (err) {
                console.log(err)
                req.flash('error', 'Something Went Wrong')
                return res.redirect('/login')
            }
        },
        register(req, res) {
            if (!req.session.user) {
                res.render('auth/register', {
                    title: 'Register - FeedMore',
                })
            }
            else {
                res.redirect('/')
            }
        },
        async postRegister(req, res) {
            const { name, email, password, cpassword, phone } = req.body

            //valid request
            if (!name || !email || !password || !cpassword || !phone) {
                req.flash('error', 'All fields are required')
                req.flash('name', name)
                req.flash('email', email)
                req.flash('phone', phone)
                return res.redirect('/register')
            }

            //Checking for Password

            if (password != cpassword) {
                req.flash('error', 'Password Not Matched')
                req.flash('name', name)
                req.flash('email', email)
                req.flash('phone', phone)
                return res.redirect('/register')
            }

            //Checking for email
            User.exists({ email: email }, (err, result) => {
                if (result) {
                    req.flash('error', 'Email Alrady Exist')
                    req.flash('name', name)
                    req.flash('email', email)
                    req.flash('phone', phone)
                    return res.redirect('/register')
                }
            })

            // Validate phone number format (10-digit Indian format)
            const phoneRegex = /^[6-9]\d{9}$/;
            if (!phoneRegex.test(phone)) {
                req.flash('error', 'Invalid Phone Number');
                req.flash('name', name);
                req.flash('email', email);
                req.flash('phone', phone)
                return res.redirect('/register');
            }

            // Check if phone already exists in phone array
            const phoneExists = await User.findOne({ phone: { $in: [phone] } });
            if (phoneExists) {
                req.flash('error', 'Phone Number Already Exists');
                req.flash('name', name);
                req.flash('email', email);
                req.flash('phone', phone)
                return res.redirect('/register');
            }

            //Strong Password Check
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
            if (!passwordRegex.test(password)) {
                req.flash('error', 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.');
                req.flash('name', name);
                req.flash('email', email);
                req.flash('phone', phone);
                return res.redirect('/register');
            }

            const hashPassword = await bcrypt.hash(password, 10)

            let user = await User.findOne({ email: email });
            if (user == null) {

                //Create a User
                const user = new User({
                    name: name,
                    email: email,
                    phone: [phone],
                    password: hashPassword
                })

                user.save().then((user) => {
                    return res.redirect('/login')
                }).catch(err => {
                    req.flash('error', 'Something Went Wrong')
                    console.log(err)
                    return res.redirect('/register')
                })
            }
        },
        async forgotPassword(req, res) {
            if (!req.session.user) {
                res.render("auth/forgotPass/verifyEmail", {
                    title: 'Forgot Password - FeedMore',
                });
            }
            else {
                res.redirect('/')
            }
        },
        async sendOtp(req, res) {
            try {
                const { email } = req.body;
                const user = await User.findOne({ email });
                if (!user) {
                    req.flash('error', 'User not found');
                    return res.redirect('/forgot-password-verify-email');
                }

                // Generate OTP
                const otp = Math.floor(100000 + Math.random() * 900000);
                const otpEntry = new OtpModel({
                    email: email,
                    otp: otp,
                    type: "forgetPass"
                });
                await otpEntry.save();

                // Send OTP via email
                const UserName = user.name;
                Mail.sendOtp(
                    email,
                    UserName,
                    otp
                ).catch(e => console.error('OTP email failed:', e));

                req.flash('success', 'OTP sent to your email');
                return res.redirect('/choose-password');

            } catch (error) {
                req.flash('error', 'Something went wrong');
                return res.redirect('/forgot-password-verify-email');
            }
        },
        async ChoosePassword(req, res) {
            try {
                if (!req.session.user) {
                    res.render("auth/forgotPass/choosePass", {
                        title: 'Forgot Password - FeedMore',
                    });
                }
                else {
                    res.redirect('/')
                }
            } catch (error) {
                req.flash('error', 'Something went wrong');
                return res.redirect('/choose-password');
            }
        },
        async verifyOtp(req, res) {
            try {
                if (!req.session.user) {
                    res.render("auth/forgotPass/verifyOtp", {
                        title: 'Forgot Password - FeedMore',
                    });
                }
                else {
                    res.redirect('/')
                }
            } catch (error) {
                req.flash('error', 'Something went wrong');
                return res.redirect('/verify-otp');
            }
        },
        async postVerifyOtp(req, res) {
            try {
                const { email, otp, password } = req.body;
                if (!email || !otp || !password) {
                    req.flash('error', 'All fields are required');
                    return res.redirect('/verify-otp');
                }

                //Check Strong Password
                const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
                if (!passwordRegex.test(password)) {
                    req.flash('error', 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.');
                    return res.redirect('/verify-otp');
                }

                //check all otp and if any otp matches then we will allow user to change password
                //check if user already exists
                const findUserOTP = await OtpModel.find({ email: email.toLowerCase().trim() })

                if (!findUserOTP || findUserOTP.length === 0) {
                    req.flash('error', "OTP Expired.")
                    return res.redirect('/verify-otp');
                }

                //check all otp and if any otp matches then we will allow user to login
                let otpMatched = false;
                findUserOTP.forEach((otpData) => {
                    if (otpData.otp == otp) {
                        otpMatched = true;
                    }
                });

                if (!otpMatched) {
                    req.flash('error', "Invalid OTP.")
                    return res.redirect('/verify-otp');
                }

                // If OTP is valid, update user password
                const hashedPassword = await bcrypt.hash(password, 10);
                await User.updateOne({ email: email.toLowerCase().trim() }, { password: hashedPassword });

                //Delete all OTPs for this user
                await OtpModel.deleteMany({ email: email.toLowerCase().trim() });

                req.flash('success', 'Success Redirecting To Login...');
                return res.redirect('/verify-otp'); // Handle route From frontend "/login"

            } catch (error) {
                req.flash('error', 'Something went wrong');
                return res.redirect('/verify-otp');
            }
        }
    }
}

module.exports = authController;