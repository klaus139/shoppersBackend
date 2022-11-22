import express, { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { VendorAttribute, VendorInstance } from "../models/vendorModel";
import {
  GenerateSignature,
  loginSchema,
  options,
  validatePassword,
} from "../utils";
import { v4 as uuidv4 } from "uuid";
import { ProductInstance } from "../models/productModel";

/**========================== Vendor Login =================**/
export const vendorLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const validateResult = loginSchema.validate(req.body, options);

    if (validateResult.error) {
      return res.status(400).json({
        Error: validateResult.error.details[0].message,
      });
    }
    //check if the User exist
    const Vendor = (await VendorInstance.findOne({
      where: { email: email },
    })) as unknown as VendorAttribute;

    if (Vendor) {
      let validation = await validatePassword(
        password,
        Vendor.password,
        Vendor.salt
      );
      if (validation) {
        //generate signature
        const signature = await GenerateSignature({
          id: Vendor.id,
          email: Vendor.email,
          serviceAvailable: Vendor.serviceAvailable,
        });
        return res.status(200).json({
          message: "You have successfully logged in",
          signature,
          email: Vendor.email,
          serviceAvailable: Vendor.serviceAvailable, //only the message prop is shown to the user
          role: Vendor.role,
        });
      }
    }
    return res.status(400).json({
      Error: "Wrong Email or Password or not a verified user",
    });
  } catch (err) {
    return res.status(500).json({
      Error: "internal Server Error",
      route: "/vendors/login",
    });
  }
};

/**=============VENDOR ADD PRODUCT================== */

export const createProduct = async (req: JwtPayload, res: Response) => {
  try {
    const id = req.vendor.id;
    // console.log(id)
    const { name, description, category, price, productType } = req.body;
    const Vendor = (await VendorInstance.findOne({
      where: { id: id },
    })) as unknown as VendorAttribute;
    const productid = uuidv4();
    if (Vendor) {
      const createProduct = await ProductInstance.create({
        id: productid,
        name,
        description,
        category,
        price,
        review: [],
        productType,
        rating: 0,
        countInStock: 0,
        numReviews: 0,
        vendorId: id,
      }); //as unknown as FoodAttribute;
      return res.status(201).json({
        message: "Product added successfully",
        createProduct,
      });
    }
    return res.status(400).json({
      message: "Vendor not found",
    });
  } catch (err: any) {
    console.log(err.message);
    return res.status(500).json({
      Error: "internal Server Error",
      route: "/vendors/create-product",
    });
  }
};

/**====================== get vendor profile=============**/
export const vendorProfile = async (req: JwtPayload, res: Response) => {
  try {
    const id = req.vendor.id;

    const vendor = (await VendorInstance.findOne({
      where: { id: id },
      attributes: [
        "id",
        "name",
        "ownerName",
        "email",
        "address",
        "serviceAvailable",
        "phone",
        "rating",
      ],
      include: [
        {
          model: ProductInstance,
          as: "product",
          attributes: [
            "id",
            "name",
            "description",
            "category",
            "price",
            "review",
            "productType",
            "rating",
            "countInStock",
            "numReviews",
            "vendorId",
          ],
        },
      ],
    })) as unknown as VendorAttribute;
    return res.status(200).json({
      message: "vendor profile",
      vendor,
    });
  } catch (err:any) {
    console.log(err.message);
    
    return res.status(500).json({
      Error: "internal Server Error",
      route: "/vendors/get-profile",

    });
  }
};
/** ================ vendor delete product===================**/
export const deleteProduct = async(req:JwtPayload, res:Response, ) => {
    try{
        const id = req.vendor.id;
        const productid = req.params.productid;

        //check if the vendor exist
        const Vendor = (await VendorInstance.findOne({where: {id: id} })) as unknown as VendorAttribute;

        if(Vendor){
            const deleteProduct = (await ProductInstance.destroy({where: {id: productid}}))
            
           return res.status(200).json({
                message: "You have deleted a product successfully",
                deleteProduct ,
            });
        }

    }catch(err){
        return res.status(500).json({
            Error: "internal Server Error",
            route: "/vendors/get-profile",
          });

    }
}