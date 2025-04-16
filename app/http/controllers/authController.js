const User = require('../../models/user')
const bcrypt = require('bcrypt');
const session = require('express-session');
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
                res.render("auth/login");
            }
            else {
                res.redirect('/')
            }
        },
        async postLogin(req, res) {
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
        },
        register(req, res) {
            if (!req.session.user) {
                res.render('auth/register')
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
        }
    }
}

module.exports = authController;