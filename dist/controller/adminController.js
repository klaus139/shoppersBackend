"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVendor = exports.AdminRegister = exports.SuperAdmin = void 0;
const uuid_1 = require("uuid");
const userModel_1 = require("../models/userModel");
const vendorModel_1 = require("../models/vendorModel");
const utils_1 = require("../utils");
/** ================= Super Admin ===================== **/
const SuperAdmin = async (req, res) => {
    try {
        const { email, phone, password, firstName, lastName, address } = req.body;
        const uuiduser = (0, uuid_1.v4)();
        const validateResult = utils_1.adminSchema.validate(req.body, utils_1.options);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        }
        // Generate salt
        const salt = await (0, utils_1.GenerateSalt)();
        const adminPassword = await (0, utils_1.GeneratePassword)(password, salt);
        // Generate OTP
        const { otp, expiry } = (0, utils_1.GenerateOtp)();
        // check if the admin exist
        const Admin = (await userModel_1.UserInstance.findOne({
            where: { email: email },
        }));
        //Create Admin
        if (!Admin) {
            await userModel_1.UserInstance.create({
                id: uuiduser,
                email,
                password: adminPassword,
                firstName,
                lastName,
                salt,
                address,
                phone,
                otp,
                otp_expiry: expiry,
                lng: 0,
                lat: 0,
                verified: true,
                role: "superadmin",
            });
            // check if the admin exist
            const Admin = (await userModel_1.UserInstance.findOne({
                where: { email: email },
            }));
            //Generate signature for user
            let signature = await (0, utils_1.GenerateSignature)({
                id: Admin.id,
                email: Admin.email,
                verified: Admin.verified,
            });
            return res.status(201).json({
                message: "Admin created successfully",
                signature,
                verified: Admin.verified,
            });
        }
        return res.status(400).json({
            message: "Admin already exist",
        });
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/admins/create-admin",
        });
    }
};
exports.SuperAdmin = SuperAdmin;
/** ================= Register Admin ===================== **/
const AdminRegister = async (req, res) => {
    try {
        const id = req.user.id;
        const { email, phone, password, firstName, lastName, address } = req.body;
        const uuiduser = (0, uuid_1.v4)();
        const validateResult = utils_1.adminSchema.validate(req.body, utils_1.options);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        }
        // Generate salt
        const salt = await (0, utils_1.GenerateSalt)();
        const adminPassword = await (0, utils_1.GeneratePassword)(password, salt);
        // Generate OTP
        const { otp, expiry } = (0, utils_1.GenerateOtp)();
        // check if the admin exist
        const Admin = (await userModel_1.UserInstance.findOne({
            where: { id: id },
        }));
        if (Admin.email === email) {
            return res.status(400).json({
                message: "Email Already exist",
            });
        }
        if (Admin.phone === phone) {
            return res.status(400).json({
                message: "Phone number already exist",
            });
        }
        //Create Admin
        if (Admin.role === "superadmin") {
            await userModel_1.UserInstance.create({
                id: uuiduser,
                email,
                password: adminPassword,
                firstName,
                lastName,
                salt,
                address,
                phone,
                otp,
                otp_expiry: expiry,
                lng: 0,
                lat: 0,
                verified: true,
                role: "admin",
            });
            // check if the admin exist
            const Admin = (await userModel_1.UserInstance.findOne({
                where: { id: id },
            }));
            //Generate signature for user
            let signature = await (0, utils_1.GenerateSignature)({
                id: Admin.id,
                email: Admin.email,
                verified: Admin.verified,
            });
            return res.status(201).json({
                message: "Admin created successfully",
                signature,
                verified: Admin.verified,
            });
        }
        return res.status(400).json({
            message: "Admin already exist",
        });
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/admins/create-admin",
        });
    }
};
exports.AdminRegister = AdminRegister;
/** ================= Create Vendor ===================== **/
const createVendor = async (req, res) => {
    try {
        const id = req.user.id;
        const { name, ownerName, pincode, phone, address, email, password } = req.body;
        const uuidvendor = (0, uuid_1.v4)();
        const validateResult = utils_1.vendorSchema.validate(req.body, utils_1.options);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        }
        // Generate salt
        const salt = await (0, utils_1.GenerateSalt)();
        const vendorPassword = await (0, utils_1.GeneratePassword)(password, salt);
        // check if the vendor exist
        const Vendor = (await vendorModel_1.VendorInstance.findOne({
            where: { email: email },
        }));
        const Admin = (await userModel_1.UserInstance.findOne({
            where: { id: id },
        }));
        if (Admin.role === "admin" || Admin.role === "superadmin") {
            if (!Vendor) {
                const createVendor = await vendorModel_1.VendorInstance.create({
                    id: uuidvendor,
                    name,
                    ownerName,
                    pincode,
                    phone,
                    address,
                    email,
                    password: vendorPassword,
                    salt,
                    role: "vendor",
                    serviceAvailable: false,
                    rating: 0,
                });
                return res.status(201).json({
                    message: "Vendor created successfully",
                    createVendor,
                });
            }
            return res.status(400).json({
                message: "Vendor already exist",
            });
        }
        return res.status(400).json({
            message: "unathorised",
        });
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/admins/create-vendors",
        });
    }
};
exports.createVendor = createVendor;
