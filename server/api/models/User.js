var Mongoose = require('mongoose'),
    Schema = Mongoose.Schema;
var UserSchema = new Schema({
    // saves user email, validation of email address is done in paylod
    userName: {
        type: String,
        unique: true,
        required: true
    },
    // hashed password is saved
    password: {
        type: String,
        required: true
    },
    // here we defines the user role like admin, customer, etc..
    scope: {
        type: String,
        enum: ['Customer'],
        required: true
    },
    //it tells about the user account/email verification. By default it is false which is not verified and changes to true when account/email gets verified
    isVerified: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

UserSchema.statics.updateUser = function(user, callback) {
    user.updatedAt = new Date();
    user.save(callback);
};

var user = Mongoose.model('user', UserSchema);
module.exports = {
    User: user
};