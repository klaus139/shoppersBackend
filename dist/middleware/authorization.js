"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authVendor = exports.auth = void 0;
const userModel_1 = require("../models/userModel");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const vendorModel_1 = require("../models/vendorModel");
//import { VendorAttribute, VendorInstance } from '../model/vendorModel';
const auth = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization;
        if (!authorization) {
            return res.status(401).json({
                error: 'Unauthorized request please login'
            });
        }
        const token = authorization.slice(7, authorization.length);
        let verified = jsonwebtoken_1.default.verify(token, config_1.APP_SECRET);
        if (!verified) {
            return res.status(401).json({
                error: 'Unauthorized, kindly sign in as a user'
            });
        }
        const { id } = verified;
        const user = (await userModel_1.UserInstance.findOne({ where: { id: id }, }));
        if (!user) {
            return res.status(401).json({
                error: 'invalid credentials please check your email and password'
            });
        }
        req.user = verified; //as {[key:string]:string}
        next();
    }
    catch (err) {
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }
};
exports.auth = auth;
const authVendor = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization; // user signature is saved in the authorization header
        if (!authorization) {
            return res.status(401).json({
                error: 'Unauthorized request please login'
            });
        }
        //bearer
        const token = authorization.slice(7, authorization.length);
        let verified = jsonwebtoken_1.default.verify(token, config_1.APP_SECRET);
        if (!verified) {
            return res.status(401).json({
                error: 'Unauthorized, kindly sign in as a user'
            });
        }
        const { id } = verified;
        const vendor = (await vendorModel_1.VendorInstance.findOne({ where: { id: id }, }));
        if (!vendor) {
            return res.status(401).json({
                error: 'invalid credentials please check your email and password'
            });
        }
        req.vendor = verified;
        next();
    }
    catch (err) {
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }
};
exports.authVendor = authVendor;
