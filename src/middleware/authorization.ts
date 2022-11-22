import  {Request, Response, NextFunction} from 'express';
import { UserInstance, UserAttributes } from '../models/userModel';
import jwt, {JwtPayload} from 'jsonwebtoken';
import { APP_SECRET } from '../config';
import { VendorInstance, VendorAttribute } from '../models/vendorModel';
//import { VendorAttribute, VendorInstance } from '../model/vendorModel';



export const auth = async(req:JwtPayload, res:Response, next:NextFunction)=>{
    try{
        const authorization = req.headers.authorization
        if(!authorization) {
            return res.status(401).json({
                error: 'Unauthorized request please login'
            })
        }

        const token = authorization.slice(7, authorization.length)
        let verified = jwt.verify(token, APP_SECRET)

        if(!verified) {
            return res.status(401).json({
                error: 'Unauthorized, kindly sign in as a user'
            })
        }

        const {id} = verified as {[key:string]: string}
        const user = (await UserInstance.findOne({where:{id:id},})) as unknown as UserAttributes
        if(!user) {
            return res.status(401).json({
                error: 'invalid credentials please check your email and password'
            })
        }
        req.user = verified; //as {[key:string]:string}
        next()



    } catch(err){
        return res.status(401).json({
            message: 'Unauthorized'
        })
    }
       
}


export const authVendor = async (req:JwtPayload, res:Response, next:NextFunction)=>{
    try{
        const authorization = req.headers.authorization // user signature is saved in the authorization header
        if(!authorization) {
            return res.status(401).json({
                error: 'Unauthorized request please login'
            })
        }
        //bearer
        const token = authorization.slice(7, authorization.length)
        let verified = jwt.verify(token, APP_SECRET) as JwtPayload;
        if(!verified) {
            return res.status(401).json({
                error: 'Unauthorized, kindly sign in as a user'
            })
        }
        const {id} = verified as {[key:string]: string}
        const vendor = (await VendorInstance.findOne({where:{id:id},})) as unknown as VendorAttribute
        if(!vendor) {
            return res.status(401).json({
                error: 'invalid credentials please check your email and password'
            })
        }
        req.vendor = verified;
        next()

    } catch(err){
        return res.status(401).json({
            message: 'Unauthorized'
        })
    }
}