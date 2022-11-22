"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserProfile = exports.getSingleUser = exports.getAllUsers = exports.resendOTP = exports.LoginUser = exports.verifyUser = exports.RegisterUser = void 0;
const uuid_1 = require("uuid");
const config_1 = require("../config");
const userModel_1 = require("../models/userModel");
const notification_1 = require("../utils/notification");
const utility_1 = require("../utils/utility");
/**================Register======================**/
const RegisterUser = async (req, res) => {
    try {
        const { email, phone, password, confirm_password } = req.body;
        const uuiduser = (0, uuid_1.v4)();
        const validateResult = utility_1.registerSchema.validate(req.body, utility_1.options);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message
            });
        }
        //Generate salt
        const salt = await (0, utility_1.GenerateSalt)();
        const userPassword = await (0, utility_1.GeneratePassword)(password, salt);
        //Generate OTP
        const { otp, expiry } = (0, notification_1.GenerateOtp)();
        // create user
        const User = await userModel_1.UserInstance.findOne({ where: { email: email } });
        if (!User) {
            await userModel_1.UserInstance.create({
                id: uuiduser,
                email,
                password: userPassword,
                firstName: "",
                lastName: "",
                salt,
                address: "",
                phone,
                otp,
                otp_expiry: expiry,
                lng: 0,
                lat: 0,
                verified: false,
                role: "user"
            });
            //send otp to the user
            await (0, notification_1.onRequestOtp)(otp, phone);
            //send email
            const html = (0, notification_1.emailHtml)(otp);
            await (0, notification_1.sendMail)(config_1.fromAdminMail, email, config_1.userSubject, html);
            //check if user exists
            const User = await userModel_1.UserInstance.findOne({ where: { email: email } });
            //Generate a signature
            let signature = await (0, utility_1.GenerateSignature)({
                id: User.id,
                email: User.email,
                verified: User.verified,
            });
            return res.status(201).json({
                message: "User created successfully",
                signature,
                verified: User.verified
            });
        }
        return res.status(400).json({
            message: "user already exist",
        });
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal Server Error",
            route: "/users/signup"
        });
    }
};
exports.RegisterUser = RegisterUser;
/**========================== verify user=================**/
const verifyUser = async (req, res) => {
    try {
        const token = req.params.signature;
        const decode = (await (0, utility_1.verifySignature)(token));
        //check if the user is a registered user
        const User = (await userModel_1.UserInstance.findOne({
            where: { email: decode.email },
        }));
        if (User) {
            const { otp } = req.body;
            if (User.otp === parseInt(otp) && User.otp_expiry >= new Date()) {
                const updatedUser = (await userModel_1.UserInstance.update({
                    verified: true,
                }, { where: { email: decode.email } }));
                // Generate new signature
                let signature = await (0, utility_1.GenerateSignature)({
                    id: updatedUser.id,
                    email: updatedUser.email,
                    verified: updatedUser.verified,
                });
                if (updatedUser) {
                    const User = (await userModel_1.UserInstance.findOne({
                        where: { email: decode.email },
                    }));
                    return res.status(200).json({
                        message: "user verified successfully",
                        signature,
                        verified: User.verified,
                    });
                }
            }
            return res.status(400).json({
                message: "otp already expired",
            });
        }
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal Server Error",
            route: "/users/verify",
        });
    }
};
exports.verifyUser = verifyUser;
/**========================== login user=================**/
const LoginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const validateResult = utility_1.loginSchema.validate(req.body, utility_1.options);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        }
        //check if user exists
        const User = (await userModel_1.UserInstance.findOne({
            where: { email: email },
        }));
        if (User) {
            const validation = await (0, utility_1.validatePassword)(password, User.password, User.salt);
            if (validation) {
                // Generate a new signature for the user
                let signature = await (0, utility_1.GenerateSignature)({
                    id: User.id,
                    email: User.email,
                    verified: User.verified,
                });
                return res.status(200).json({
                    message: "You have logged in successfully",
                    signature,
                    email: User.email,
                    verified: User.verified,
                });
            }
        }
        return res.status(400).json({
            message: "incorrect email or password",
        });
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal Server Error",
            route: "/users/login",
        });
    }
};
exports.LoginUser = LoginUser;
/**========================== Resend OTP =================**/
const resendOTP = async (req, res) => {
    try {
        const token = req.params.signature;
        const decode = await (0, utility_1.verifySignature)(token);
        //check if the user is a registered user
        const User = (await userModel_1.UserInstance.findOne({ where: { email: decode.email } }));
        if (User) {
            //generate otp
            const { otp, expiry } = (0, notification_1.GenerateOtp)();
            const updatedUser = await userModel_1.UserInstance.update({
                otp,
                otp_expiry: expiry
            }, { where: { email: decode.email } });
            if (updatedUser) {
                const User = (await userModel_1.UserInstance.findOne({ where: { email: decode.email } }));
                await (0, notification_1.onRequestOtp)(otp, User.phone);
            }
            //send mail
            const html = (0, notification_1.emailHtml)(otp);
            await (0, notification_1.sendMail)(config_1.fromAdminMail, updatedUser.email, config_1.userSubject, html);
            return res.status(200).json({
                message: "OTP resent successfully, Please check your mail or phone"
            });
        }
        return res.status(400).json({
            message: "Error sending OTP"
        });
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal Server Error",
            route: "/users/resend-OTP/:signature",
        });
    }
};
exports.resendOTP = resendOTP;
/**========================== User Profile =================**/
const getAllUsers = async (req, res) => {
    try {
        const limit = req.query.limit;
        const users = await userModel_1.UserInstance.findAndCountAll({ limit: limit });
        return res.status(200).json({
            message: "successfully retrieved all users",
            Count: users.count,
            Users: users.rows
        });
    }
    catch (err) {
        return res.status(500).json({
            Error: "Internal Server Error",
            route: "/users/get-all-users"
        });
    }
};
exports.getAllUsers = getAllUsers;
const getSingleUser = async (req, res) => {
    try {
        const id = req.user.id;
        //find user by id
        const User = (await userModel_1.UserInstance.findOne({
            where: { id: id },
        }));
        if (User) {
            return res.status(200).json({
                User
            });
        }
        return res.status(400).json({
            message: "User not found",
        });
    }
    catch (err) {
        return res.status(500).json({
            Error: "Internal Server Error",
            route: "/users/get-all-users"
        });
    }
};
exports.getSingleUser = getSingleUser;
const updateUserProfile = async (req, res) => {
    try {
        const id = req.user.id;
        const { firstName, lastName, address, phone } = req.body;
        //Joi validation
        const validateResult = utility_1.updateSchema.validate(req.body, utility_1.options);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message
            });
        }
        //check if the user is a registered user
        const User = (await userModel_1.UserInstance.findOne({ where: { id: id } }));
        if (!User) {
            return res.status(400).json({
                Error: "you are not authorized to update your profile"
            });
        }
        const updatedUser = (await userModel_1.UserInstance.update({
            firstName,
            lastName,
            address,
            phone
        }, { where: { id: id } }));
        if (updatedUser) {
            const User = (await userModel_1.UserInstance.findOne({ where: { id: id } }));
            return res.status(200).json({
                message: "successfully updated user profile",
                User,
            });
        }
        return res.status(400).json({
            message: "Error occured"
        });
    }
    catch (err) {
        return res.status(500).json({
            Error: "Internal Server Error",
            route: "/users/update-profile"
        });
    }
};
exports.updateUserProfile = updateUserProfile;
