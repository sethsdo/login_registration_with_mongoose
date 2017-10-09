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
        }
        if (!req.session.errors) {
            req.session.errors = []
        }
        if (!req.session.login) {
            req.session.login = []
        }
        const context = {
            "errors": req.session.errors,
            "lg_err": req.session.login
        }
        res.render("index", context)
        req.session.destroy()
        
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
                    req.session.errors = newUser.errors
                    return res.redirect('/')
                }
                console.log(newUser)
                req.session.user = req.body.email;
                res.redirect('/dashboard')
            })
        }
    },
    login: function (req, res) {
        const email = req.checkBody('email', 'Email input must be entered').notEmpty()
        const pwd = req.checkBody('pwd', 'Password input must be full').notEmpty()
        var errors = req.validationErrors();
        if (errors) {
            req.session.login = errors
            for (let dd in req.session.login){
                console.log(req.session.login[dd].msg)
            }
            return res.redirect('/')
        }
        else{
            const user = User.findOne({ email: req.body.email }, function(err, current_user) {
                if (err) { 
                    return res.redirect('/')
                }
                current_user.comparePassword(req.body.pwd, function(err, isMatch) {
                    if (err) {
                        console.log("hello")
                        req.session.errors = "password does not match!"
                        return res.redirect('/')
                    }
                    req.session.user = req.body.email
                    res.redirect("/dashboard")
                })
            })
        }
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