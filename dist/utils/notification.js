"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailHtml = exports.sendMail = exports.onRequestOtp = exports.GenerateOtp = void 0;
const config_1 = require("../config");
const dotenv_1 = __importDefault(require("dotenv"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const express_1 = require("express");
dotenv_1.default.config();
const GenerateOtp = () => {
    const otp = Math.floor(1000 + Math.random() * 9000);
    console.log(otp);
    const expiry = new Date();
    expiry.setTime(new Date().getTime() + (30 * 60 * 1000));
    return { otp, expiry };
};
exports.GenerateOtp = GenerateOtp;
const onRequestOtp = async (otp, toPhoneNumber) => {
    const client = require('twilio')(config_1.accountSid, config_1.authToken);
    const response = await client.messages.create({
        body: `your otp is ${otp}`,
        to: toPhoneNumber,
        from: config_1.fromAdminPhone
    });
    return response;
};
exports.onRequestOtp = onRequestOtp;
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: config_1.GMAIL_USER,
        pass: config_1.GMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});
const sendMail = async (from, to, subject, html) => {
    try {
        await transporter.sendMail({
            from: config_1.fromAdminMail, to, subject: config_1.userSubject, html
        });
        return express_1.response;
    }
    catch (err) {
        console.log(err);
    }
};
exports.sendMail = sendMail;
const emailHtml = (otp) => {
    let response = `
    <div style="max-width:700px;
    margin:auto;
    solid #ccc;
    padding:20px;
    font-size:16px;
    font-family:Helvetica, Arial, sans-serif;
    font-weight:normal;
    line-height:1.5;
    color:#333;
    background:#f8f8f8;
    border:1px solid #ccc;
    border-radius:3px;
    margin-bottom:20px;
    margin-top:20px;
    ">
    <h2 style="text-align:center;
    text-transform:uppercase;
    color:teal;
    ">welcome to Shop Smart</h2>
    <p>Hi there your otp is ${otp}</p>
    </div>`;
    return response;
};
exports.emailHtml = emailHtml;
//YyIzINNwXII29jvTJr7ixhdWfCCYccv8xYJCg0ue
//4834963
