import Joi from 'joi';
import bcrypt from 'bcrypt';
import {AuthPayload } from "../interface";
import { APP_SECRET } from '../config';
import jwt, { JwtPayload } from 'jsonwebtoken';


export const registerSchema = Joi.object().keys({
    email: Joi.string().required(),
    phone: Joi.string().required(),
    password: Joi.string().required().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
    confirm_password: Joi.any().equal(Joi.ref('password')).required().label('confirm password').messages({'any.only': '{{#label}} does not match'})
    
});

export const updateSchema = Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    address: Joi.string().required(),
    phone: Joi.string().required()

})

export const adminSchema = Joi.object().keys({
    email: Joi.string().required(),
    phone: Joi.string().required(),
    password: Joi.string().required().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    address : Joi.string().required()

    
})

export const vendorSchema = Joi.object().keys({
    email: Joi.string().required(),
    phone: Joi.string().required(),
    password: Joi.string().required().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
    name: Joi.string().required(),
    ownerName: Joi.string().required(),
    address: Joi.string().required(),
    pincode: Joi.string().required(),
});


export const options = {
    abortEarly: false, // include all errors
    errors: {
        wrap: {
            label: ''
        }
    }
};

export const GenerateSalt = async() => {
    return await bcrypt.genSalt(); // gnerate a random number of salt
}

export const GeneratePassword = async(password:string, salt:string)=> {
    return await bcrypt.hash(password, salt);
}
export const GenerateSignature = async(payload:AuthPayload)=> {
    return jwt.sign(payload, APP_SECRET, { expiresIn: '1d' });
}

export const verifySignature = async(signature:string)=> { 
    return jwt.verify(signature, APP_SECRET) as JwtPayload;
}

export const loginSchema = Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
});

export const validatePassword = async(enteredPassword:string, savedPassword:string, salt:string)=> {
    return await GeneratePassword(enteredPassword, salt) === savedPassword;
}

