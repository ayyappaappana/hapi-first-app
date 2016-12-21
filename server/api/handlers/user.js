var Joi = require('joi'),
    Boom = require('boom'),
    Common = require('../common'),
    Config = require('../../config/config'),
    Jwt = require('jsonwebtoken'),
    User = require('../models/User').User,
    Tokens = require('../models/Tokens').Tokens;
var privateKey = Config.key.privateKey;

exports.getAll = {
    handler: function(request, reply) {
        User.find({}, function(err, user) {
            if (!err) {
                reply(user);
            } else {
                reply(Boom.badImplementation(err)); // 500 error
            }
        });
    }
};

exports.getOne = {
    handler: function(request, reply) {
        User.findOne({
            _id: request.params.userId
        }, function(err, user) {
            if (!err) {
                reply(user);
            } else {
                reply(Boom.badImplementation(err)); // 500 error
            }
        });
    }
};

exports.create = {
    validate: {
        payload: {
            userName: Joi.string().email().required(), //ensures to be a valid email address and mandatory filled 
            password: Joi.string().required() //ensures to be mandatory filled
        }
    },
    handler: function(request, reply) {
        request.payload.password = Common.encrypt(request.payload.password); // encrypt password before saving.
        request.payload.scope = "Customer";

        User.create(request.payload, function(err, user) {
            if (!err) {

                // prepare a data which is signed and send in token
                var tokenData = {
                    userName: user.userName,
                    scope: [user.scope],
                    id: user._id
                };

                // prepare a token for verification link which is send in email. send email method and link preparation method is written in common.js file common.js.
                Common.sentMailVerificationLink(user,Jwt.sign(tokenData, privateKey));
                reply("Please confirm your email id by clicking on link in email");
            } else {
                if (11000 === err.code || 11001 === err.code) {
                    reply(Boom.forbidden("please provide another user email"));
                } else reply(Boom.forbidden(err)); // HTTP 403
            }
        });
    }
};

/*exports.create = {
    validate: {
        payload: {
            userId: Joi.string().required(),
            userName: Joi.string().required()
        }
    },
    handler: function(request, reply) {
        var user = new User(request.payload);
        user.save(function(err, user) {
            if (!err) {
                reply(user).created('/user/' + user._id); // HTTP 201
            } else {
                if (11000 === err.code || 11001 === err.code) {
                    reply(Boom.forbidden("please provide another user id, it already exist"));
                } else reply(Boom.forbidden(getErrorMessageFrom(err))); // HTTP 403
            }
        });
    }
};*/

exports.update = {
    validate: {
        payload: {
            userName: Joi.string().required()
        }
    },

    handler: function(request, reply) {
        User.findOne({
            _id: request.params.userId
        }, function(err, user) {
            if (!err) {
                user.userName = request.payload.userName;
                User.updateUser(user, function(err, user) {
                    if (!err) {
                        reply(user);
                    } else {
                        if (11000 === err.code || 11001 === err.code) {
                            reply(Boom.forbidden("please provide another user id, it already exist"));
                        } else reply(Boom.forbidden(getErrorMessageFrom(err))); // HTTP 403
                    }
                });
            } else {
                reply(Boom.badImplementation(err)); // 500 error
            }
        });
    }
};

exports.remove = {
    handler: function(request, reply) {
        User.findOne({
            _id: request.params.userId
        }, function(err, user) {
            if (!err && user) {
                user.remove();
                reply({
                    message: "User deleted successfully"
                });
            } else {
                reply(Boom.badRequest("Could not delete user"));
            }
        });
    }
};

exports.login = {
    validate: {
        payload: {
            userName: Joi.string().email().required(),
            password: Joi.string().required()
        }
    },
    handler: function(request, reply) {
        User.findOne({userName:request.payload.userName}, function(err, user) {
            if (!err) {
                if (user === null) return reply(Boom.forbidden("invalid userName or password"));
                if (request.payload.password === Common.decrypt(user.password)) {

                    if(!user.isVerified) return reply("Your email address is not verified. please verify your email address to proceed");

                    var tokenData = {
                        userName: user.userName,
                        scope: [user.scope],
                        id: user._id
                    };
                    var res = {
                        userName: user.userName,
                        scope: user.scope,
                        token: Jwt.sign(tokenData, privateKey)
                    };
                    Tokens.create({userId: user.id,token: res.token}, function(err, token) {
                       if(!err) {
                            reply(res);
                       } 
                    });
                } else reply(Boom.forbidden("invalid userName or password"));
            } else {
                if (11000 === err.code || 11001 === err.code) {
                    reply(Boom.forbidden("please provide another user email"));
                } else {
                        console.error(err);
                        return reply(Boom.badImplementation(err));
                } 
            }
        });
    }
};

exports.resendVerificationEmail = {
    validate: {
        payload: {
            userName: Joi.string().email().required(),
            password: Joi.string().required()
        }
    },
    handler: function(request, reply) {
        User.findOne({userName:request.payload.userName}, function(err, user) {
            if (!err) {
                if (user === null) return reply(Boom.forbidden("invalid userName or password"));
                if (request.payload.password === Common.decrypt(user.password)) {

                    if(user.isVerified) return reply("your email address is already verified");

                     var tokenData = {
                        userName: user.userName,
                        scope: [user.scope],
                        id: user._id
                    };
                    Common.sentMailVerificationLink(user,Jwt.sign(tokenData, privateKey));
                    reply("account verification link is sucessfully send to an email id");
                } else reply(Boom.forbidden("invalid userName or password"));
            } else {                
                console.error(err);
                return reply(Boom.badImplementation(err));
            }
        });
    }
};

exports.forgotPassword = {
    validate: {
        payload: {
            userName: Joi.string().email().required()
        }
    },
    handler: function(request, reply) {
        User.findOne({userName:request.payload.userName}, function(err, user) {
            if (!err) {
                if (user === null) return reply(Boom.forbidden("invalid userName"));
                Common.sentMailForgotPassword(user);
                reply("password is send to registered email id");
            } else {       
                console.error(err);
                return reply(Boom.badImplementation(err));
             }
        });
    }
};

exports.verifyEmail = {
    handler: function(request, reply) {
        Jwt.verify(request.headers.authorization.split(" ")[1], privateKey, function(err, decoded) {
            if(decoded === undefined) return reply(Boom.forbidden("invalid verification link"));
            if(decoded.scope[0] != "Customer") return reply(Boom.forbidden("invalid verification link"));
            User.findOne({_id:decoded.id,userName: decoded.userName}, function(err, user){
                if (err) {
                    console.error(err);
                    return reply(Boom.badImplementation(err));
                }
                if (user === null) return reply(Boom.forbidden("invalid verification link"));
                if (user.isVerified === true) return reply(Boom.forbidden("account is already verified"));
                user.isVerified = true;
                User.updateUser(user, function(err, user){
                    if (err) {
                        console.error(err);
                        return reply(Boom.badImplementation(err));
                    }
                    return reply("account sucessfully verified");

                })
            })
            
        });
    }
};