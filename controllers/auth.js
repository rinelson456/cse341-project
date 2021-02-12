const bcrypt = require('bcryptjs');
const User = require('../models/user');
const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator');

const transporter = nodemailer.createTransport(sendGridTransport({
    auth: {
        api_key: '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'
    }
}));


exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false
    });
};

exports.getSignup = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: message,
        isAuthenticated: false
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                return res.redirect('/login');
            }
            bcrypt.compare(password, user.password).then(result => {
                if (result) {
                    req.session.isLoggedIn = true;
                    req.session.user = user;
                    req.session.save(err => {
                        console.log(err);
                        res.redirect('/')
                    });
                } else {
                    res.redirect('/login')
                }
            }).catch(err => {
                console.log(err);
                res.redirect('/login');

            });
        })
        .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).render('auth/signup', {
            path: '/signup',
            pageTitle: 'Signup',
            isAuthenticated: false,
            errorMessage: errors.array()[0].msg
        });
    }

    User.findOne({ email: email }).then(userDoc => {
        if (userDoc) {
            return res.redirect('/signup');
        }
        return bcrypt.hash(password, 12)
            .then(hashedPassword => {
                const user = new User({
                    email: email,
                    password: hashedPassword,
                    cart: { items: [] }
                });
                return user.save();;
            })
            .then(result => {
                res.redirect('/login');
                return transporter.sendMail({
                    to: email,
                    from: 'rileyrusnelson@gmail.com',
                    subject: 'Signup Succeeded!',
                    html: '<h1> You signed up successfully! </h1>'
                });
            });
    })

    .catch(err => {
        console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
};