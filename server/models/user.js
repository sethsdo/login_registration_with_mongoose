
const mongoose = require('mongoose')
const bcrypt = require("bcrypt")

var validateEmail = function (email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    first_name: {
        type: String,
        required: [true, "First Name required"],
        maxlength: 45, minlength: 3,
    },
    last_name: {
        type: String,
        required: [true, "Last Name required"],
        maxlength: 45, minlength: 3,
    },
    pwd: {
        type: String,
        required: [true, "PWD required"],
        minlength: 8,
        maxlength: 32,
        // validate: {
        //     validator: function (value) {
        //         return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,32}/.test(value);
        //     },
        //     message: "Password failed validation, you must have at least 1 number, uppercase and special character"
        // }
    },
    bday: {
        type: Date,
        required: [true, "Date required"],
    }
})

UserSchema.pre('save', function (next) {
    var user = this;
    
    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.pwd, salt, function (err, hash) {
            if (err) return next(err);

            user.pwd = hash;
            next();
        });
    });
});


UserSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.pwd, function (err, isMatch) {
        if (err) return cb("does not match");
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema)
console.log("User model was registered")