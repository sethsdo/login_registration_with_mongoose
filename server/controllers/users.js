'use strict'

const mongoose = require('mongoose')
const User = mongoose.model('User')
const session = require('express-session');
const current_user = require("../models/user")();
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');


module.exports = {
    login_and_registration: function (req, res) {
        if(!req.session.user) {
            req.session.user = ''
            console.log(req.session.user)
        }
        return res.render("index")
    },
    registration: function (req, res) {
        const newUser = new User({ email: req.body.email, first_name: req.body.first_name, last_name: req.body.last_name, pwd: req.body.pwd, bday: req.body.bday })
        if (newUser === User.findOne({ email: req.body.email })) {
            console.log("already in db")
        } else {
            newUser.save(function (err) {
                if (err) {
                    if (req.body.pwd != req.body.confirm_pwd) {
                        console.log("passwords don't match")
                    }
                    console.log(newUser.errors)
                    return res.render('index', { errors: newUser.errors })
                }
                console.log(newUser)
                req.session.user = req.body.email;
                res.redirect('/dashboard')
            })
        }
    },
    login: function (req, res) {
        req.checkBody(req.params.email, 'Input must be full').notEmpty();
        req.checkBody(req.params.pwd, 'Password input must be full').notEmpty();
        
        const user = User.findOne({ email: req.body.email }, function(err, current_user) {
            if (err) { res.render('index', { errors: "Invalid email!" }) }
            current_user.comparePassword(req.body.pwd, function(err, isMatch) {
                if (err) {
                    console.log("hello")
                    res.render('index', {errors: "password does not match!"})
                }
                req.session.user = req.body.email
                res.redirect("/dashboard")
            })
        })
    },
    dashboard: function (req, res) {
        console.log(req.session.user)
        User.findOne({email: req.session.user }, function(err, user) {
            if(err) { console.log("something went worng!")}
            const context = {
                "user": user
            }
            res.render("user_page", context)
        })
    },
    logout: function(req, res) {
        console.log("hello")
        req.session.user = null
        console.log(req.session.user)
        res.redirect('/')
    }
}