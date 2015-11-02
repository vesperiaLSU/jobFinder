(function() {
    var User = require("../Models/User.js");
    var createResponseToken = require("./createResponseToken.js");
    var messages = require("../Config/messageConfig.js");
    var emailVerification = require("./emailVerification.js");

    module.exports = function(req, res) {
        var user = req.body;
        var newUser = new User({
            email: user.email,
            password: user.password,
            active: false
        });

        var searchUser = {
            email: user.email
        };

        User.findOne(searchUser, function(err, user) {
            if (err) throw err;

            if (user) return res.status(401).send({
                message: messages.EMAIL_DUPLICATE
            });

            newUser.save(function() {
                emailVerification.send(searchUser);
                createResponseToken(newUser, req, res);
            });
        });
    };
}());