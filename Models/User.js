(function() {
    "use strict";
    var Promise = require("bluebird");
    var mongoose = Promise.promisifyAll(require("mongoose"));
    var bcrypt = require("bcrypt-nodejs");

    var UserSchema = new mongoose.Schema({
        email: {
            type: String,
            required: true
        },
        password: String,
        googleId: String,
        facebookId: String,
        displayName: String,
        active: {
            type: Boolean,
            required: true
        },
        jobViewed: [Number],
        jobPosted: [Number],
        jobApplied: [Number],
        jobMarked: [Number]
    });

    UserSchema.methods.toJSON = function() {
        var user = this.toObject();
        delete user.password;

        return user;
    };

    UserSchema.methods.comparePasswords = function(password, callback) {
        bcrypt.compare(password, this.password, callback);
    };

    UserSchema.pre("save", function(next) {
        var user = this;

        if (!user.isModified("password")) {
            return next();
        }

        bcrypt.genSalt(10, function(err, salt) {
            if (err) {
                return next(err);
            }

            bcrypt.hash(user.password, salt, null, function(err, hash) {
                if (err) {
                    return next(err);
                }

                user.password = hash;
                next();
            })
        })
    });

    module.exports = mongoose.model("User", UserSchema);
}());