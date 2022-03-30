const User = require('../../models/user')
const bcrypt = require('bcrypt');
const session = require('express-session');
function authController() {
    return {
        login(req, res) {
            if(!req.session.user){
            res.render("auth/login");
            }
            else{
                res.redirect('/')
            }
        },
        async postLogin(req, res) {
            const { email, password } = req.body

            if (email == '' || password == '') {
                req.flash('error','All Field Requred')
                req.flash('email',email)
                return res.redirect('/login')
            }

            let user = await User.findOne({ email: email })

            if (user == null) {
                req.flash('error', 'Invalid Email id')
                req.flash('email',email)
                return res.redirect('/login')
            }

            let compPass = await bcrypt.compare(password,user.password)
            if(!compPass){
                req.flash('error','Invalid Email or Password')
                req.flash('email',email)
                return res.redirect('/login')
            }

            req.session.user = {email:email,name:user.name};
            res.redirect('/')
        },
        register(req, res) {
            if(!req.session.user){
            res.render('auth/register')
            }
            else{
                res.redirect('/')
            }
        },
        async postRegister(req, res) {
            const { name, email, password, cpassword } = req.body

            //valid request
            if (!name || !email || !password || !cpassword) {
                req.flash('error', 'All fields are required')
                req.flash('name', name)
                req.flash('email', email)
                return res.redirect('/register')
            }

            //Checking for Password

            if (password != cpassword) {
                req.flash('error', 'Password Not Matched')
                req.flash('name', name)
                req.flash('email', email)
                return res.redirect('/register')
            }

            //Checking for email
            User.exists({ email: email }, (err, result) => {
                if (result) {
                    req.flash('error', 'Email Alrady Exist')
                    req.flash('name', name)
                    req.flash('email', email)
                    return res.redirect('/register')
                }
            })

            const hashPassword = await bcrypt.hash(password, 10)

            let user = await User.findOne({ email: email });
            if (user == null) {

                //Create a User
                const user = new User({
                    name: name,
                    email: email,
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