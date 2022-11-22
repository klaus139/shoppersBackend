"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.vendorProfile = exports.createProduct = exports.vendorLogin = void 0;
const vendorModel_1 = require("../models/vendorModel");
const utils_1 = require("../utils");
const uuid_1 = require("uuid");
const productModel_1 = require("../models/productModel");
/**========================== Vendor Login =================**/
const vendorLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const validateResult = utils_1.loginSchema.validate(req.body, utils_1.options);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        }
        //check if the User exist
        const Vendor = (await vendorModel_1.VendorInstance.findOne({
            where: { email: email },
        }));
        if (Vendor) {
            let validation = await (0, utils_1.validatePassword)(password, Vendor.password, Vendor.salt);
            if (validation) {
                //generate signature
                const signature = await (0, utils_1.GenerateSignature)({
                    id: Vendor.id,
                    email: Vendor.email,
                    serviceAvailable: Vendor.serviceAvailable,
                });
                return res.status(200).json({
                    message: "You have successfully logged in",
                    signature,
                    email: Vendor.email,
                    serviceAvailable: Vendor.serviceAvailable,
                    role: Vendor.role,
                });
            }
        }
        return res.status(400).json({
            Error: "Wrong Email or Password or not a verified user",
        });
    }
    catch (err) {
        return res.status(500).json({
            Error: "internal Server Error",
            route: "/vendors/login",
        });
    }
};
exports.vendorLogin = vendorLogin;
/**=============VENDOR ADD PRODUCT================== */
const createProduct = async (req, res) => {
    try {
        const id = req.vendor.id;
        // console.log(id)
        const { name, description, category, price, productType } = req.body;
        const Vendor = (await vendorModel_1.VendorInstance.findOne({
            where: { id: id },
        }));
        const productid = (0, uuid_1.v4)();
        if (Vendor) {
            const createProduct = await productModel_1.ProductInstance.create({
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
    }
    catch (err) {
        console.log(err.message);
        return res.status(500).json({
            Error: "internal Server Error",
            route: "/vendors/create-product",
        });
    }
};
exports.createProduct = createProduct;
/**====================== get vendor profile=============**/
const vendorProfile = async (req, res) => {
    try {
        const id = req.vendor.id;
        const vendor = (await vendorModel_1.VendorInstance.findOne({
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
                    model: productModel_1.ProductInstance,
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
        }));
        return res.status(200).json({
            message: "vendor profile",
            vendor,
        });
    }
    catch (err) {
        console.log(err.message);
        return res.status(500).json({
            Error: "internal Server Error",
            route: "/vendors/get-profile",
        });
    }
};
exports.vendorProfile = vendorProfile;
/** ================ vendor delete product===================**/
const deleteProduct = async (req, res) => {
    try {
        const id = req.vendor.id;
        const productid = req.params.productid;
        //check if the vendor exist
        const Vendor = (await vendorModel_1.VendorInstance.findOne({ where: { id: id } }));
        if (Vendor) {
            const deleteProduct = (await productModel_1.ProductInstance.destroy({ where: { id: productid } }));
            return res.status(200).json({
                message: "You have deleted a product successfully",
                deleteProduct,
            });
        }
    }
    catch (err) {
        return res.status(500).json({
            Error: "internal Server Error",
            route: "/vendors/get-profile",
        });
    }
};
exports.deleteProduct = deleteProduct;
