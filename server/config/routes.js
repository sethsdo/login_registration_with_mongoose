const users = require('../controllers/users.js')

module.exports = function (app) {
    app.get('/', users.login_and_registration)
    app.post('/login', users.login)
    app.post('/registration', users.registration)
    app.get('/dashboard', users.dashboard)
    app.get('/logout', users.logout)
}