"use strict"

const mongoose = require('mongoose');

const fs = require('fs');
const path = require('path')
mongoose.Promise = global.Promise

mongoose.connect('mongodb://localhost/user_mongoose')

const models_path = path.join(__dirname, './../models')

fs.readdirSync(models_path).forEach(function (file) {
    if (file.indexOf('js') >= 0) {
        require(models_path + '/' + file);
    }
})