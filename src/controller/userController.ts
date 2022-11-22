import express, {Request, Response} from 'express';
import { JwtPayload } from 'jsonwebtoken';
import SendmailTransport from 'nodemailer/lib/sendmail-transport';
import {v4 as uuidv4} from 'uuid';
import { fromAdminMail, userSubject } from '../config';
import { UserAttributes, UserInstance } from '../models/userModel';
import { emailHtml, GenerateOtp, onRequestOtp, sendMail } from '../utils/notification';
import { GeneratePassword, GenerateSalt, GenerateSignature, loginSchema, options, registerSchema, updateSchema, validatePassword, verifySignature } from '../utils/utility';

/**================Register======================**/
export const RegisterUser = async (req: Request, res: Response) => {
    try{
        const { email, phone, password, confirm_password } = req.body;
        const uuiduser = uuidv4();

        const validateResult = registerSchema.validate(req.body, options)
        if(validateResult.error){
            return res.status(400).json({
                 Error: validateResult.error.details[0].message
            })
        }

        //Generate salt
        const salt = await GenerateSalt();
        const userPassword = await GeneratePassword(password, salt);

        //Generate OTP
        const { otp, expiry } = GenerateOtp();

        // create user
        const User = await UserInstance.findOne({ where: { email: email } });
        if (!User) {
            await UserInstance.create({
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
            })

            //send otp to the user
            await onRequestOtp(otp, phone);

            //send email
            const html = emailHtml(otp);

           await sendMail(fromAdminMail, email, userSubject, html);

           //check if user exists
              const User = await UserInstance.findOne({ where: { email: email } }) as unknown as UserAttributes

              //Generate a signature
            let signature = await GenerateSignature({
                id: User.id,
                email: User.email,
                verified: User.verified,

            });

            return res.status(201).json({
                message: "User created successfully",
                signature,
                verified: User.verified

            })

        }
        return res.status(400).json({
            message: "user already exist",
          });

    
    } catch(err){
        res.status(500).json({
            Error: "Internal Server Error",
            route: "/users/signup"

        })
        
    }
}
;

/**========================== verify user=================**/
export const verifyUser = async (req: Request, res: Response) => {
    try {
      const token = req.params.signature;
      const decode = (await verifySignature(token)) as JwtPayload;
      //check if the user is a registered user
      const User = (await UserInstance.findOne({
        where: { email: decode.email },
      })) as unknown as UserAttributes;
      if (User) {
        const { otp } = req.body;
        if (User.otp === parseInt(otp) && User.otp_expiry >= new Date()) {
          const updatedUser = (await UserInstance.update(
            {
              verified: true,
            },
            { where: { email: decode.email } }
          )) as unknown as UserAttributes;
  
          // Generate new signature
          let signature = await GenerateSignature({
            id: updatedUser.id,
            email: updatedUser.email,
            verified: updatedUser.verified,
          });
          if (updatedUser) {
            const User = (await UserInstance.findOne({
              where: { email: decode.email },
            })) as unknown as UserAttributes;
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
    } catch (err) {
      res.status(500).json({
        Error: "Internal Server Error",
        route: "/users/verify",
      });
    }
  };
  
  /**========================== login user=================**/
export const LoginUser = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const validateResult = loginSchema.validate(req.body, options);
      if (validateResult.error) {
        return res.status(400).json({
          Error: validateResult.error.details[0].message,
        });
      }
  
      //check if user exists
      const User = (await UserInstance.findOne({
        where: { email: email },
      })) as unknown as UserAttributes;
      if (User) {
        const validation = await validatePassword(
          password,
          User.password,
          User.salt
        );
        if (validation) {
          // Generate a new signature for the user
          let signature = await GenerateSignature({
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
    } catch (err) {
      res.status(500).json({
        Error: "Internal Server Error",
        route: "/users/login",
      });
    }
  };

  /**========================== Resend OTP =================**/
export const resendOTP = async (req: Request, res: Response) => {
    try{
        const token = req.params.signature;
        const decode = await verifySignature(token) as JwtPayload;
        //check if the user is a registered user
       const User = (await UserInstance.findOne({ where: { email: decode.email } })) as unknown as UserAttributes;
         if(User){
            //generate otp
            const { otp, expiry } = GenerateOtp();

            const updatedUser = await UserInstance.update({ 
                otp,
                otp_expiry: expiry
            }, { where: { email: decode.email } }) as unknown as UserAttributes;

            if(updatedUser){
                const User = (await UserInstance.findOne({ where: { email: decode.email } })) as unknown as UserAttributes;
                await onRequestOtp(otp, User.phone);
            }
            //send mail
            const html = emailHtml(otp);

            await sendMail(fromAdminMail, updatedUser.email, userSubject, html);
            return res.status(200).json({
                message: "OTP resent successfully, Please check your mail or phone"
            });
        }
        return res.status(400).json({
            message: "Error sending OTP"
        });
            
    } catch(err){
        res.status(500).json({
            Error: "Internal Server Error",
            route: "/users/resend-OTP/:signature",
        });
    }
}

/**========================== User Profile =================**/

export const getAllUsers = async(req: Request, res: Response)=> {
    try {
      const limit = req.query.limit as number | undefined
      const users = await UserInstance.findAndCountAll({limit: limit})
      return res.status(200).json({
        message: "successfully retrieved all users", 
        Count:users.count,
        Users:users.rows
      });
       
  
    } catch (err) {
      return res.status(500).json({
        Error: "Internal Server Error",
        route: "/users/get-all-users"
      });
    }
  
      
  }
  
  export const getSingleUser = async(req:JwtPayload, res:Response) =>{
    try{
        const id = req.user.id

        //find user by id
        const User = (await UserInstance.findOne({
            where: { id: id},
          })) as unknown as UserAttributes;

          if(User){
            return res.status(200).json({
                User
            })
          }
          return res.status(400).json({
            message: "User not found",
          })

    }catch(err){
        return res.status(500).json({
            Error: "Internal Server Error",
            route: "/users/get-all-users"
          });
    }
  }
  
  
  
  
  export const updateUserProfile =async(req: JwtPayload, res: Response)=>{
    try{
        const id=req.user.id;
        const {firstName, lastName, address, phone } = req.body;
        //Joi validation
        const validateResult = updateSchema.validate(req.body, options)
        if(validateResult.error){
          return res.status(400).json({
            Error: validateResult.error.details[0].message
          });
        }
        //check if the user is a registered user
        const User = (await UserInstance.findOne({ where: { id: id } })) as unknown as UserAttributes;
        if(!User){
          return res.status(400).json({
            Error: "you are not authorized to update your profile"
          });
        }
        const updatedUser = (await UserInstance.update({
          firstName,
          lastName,
          address,
          phone
          }, { where: { id: id } }
          )) as unknown as UserAttributes;
  
          if(updatedUser){
  
            const User = (await UserInstance.findOne({ where: { id: id } })) as unknown as UserAttributes
            return res.status(200).json({
              message: "successfully updated user profile",
              User,
            })
          }
          return res.status(400).json({
            message: "Error occured"
          });
          
    } catch(err){
      return res.status(500).json({
        Error: "Internal Server Error",
        route: "/users/update-profile"
      });
    }
  }
  
  
  

