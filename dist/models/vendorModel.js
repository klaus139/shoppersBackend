"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorInstance = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("../config");
const productModel_1 = require("./productModel");
//export the instance to use in checking if user exist
class VendorInstance extends sequelize_1.Model {
}
exports.VendorInstance = VendorInstance;
VendorInstance.init({
    id: {
        type: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notNull: { msg: "Email ddress is required" },
            isEmail: { msg: "please provide a valid email" }
        }
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: "passoword is required" },
            notEmpty: { msg: 'provide a password' }
        }
    },
    ownerName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    pincode: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    salt: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: "salt is required" },
            notEmpty: { msg: "provide a salt" }
        }
    },
    address: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    phone: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: "phone number is required" },
            notEmpty: { msg: "provide a phone number" }
        }
    },
    rating: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: true,
    },
    serviceAvailable: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: true,
    },
    role: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    }
}, {
    sequelize: config_1.db,
    tableName: "vendor"
});
VendorInstance.hasMany(productModel_1.ProductInstance, { foreignKey: 'vendorId', as: 'product' });
productModel_1.ProductInstance.belongsTo(VendorInstance, { foreignKey: 'vendorId', as: 'vendor' });
