"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductInstance = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("../config");
//export the instance to use in checking if user exist
class ProductInstance extends sequelize_1.Model {
}
exports.ProductInstance = ProductInstance;
ProductInstance.init({
    id: {
        type: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    price: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: true,
    },
    review: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.JSON),
    },
    category: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    productType: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    rating: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: true,
    },
    countInStock: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: false,
    },
    numReviews: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: false,
    },
    vendorId: {
        type: sequelize_1.DataTypes.UUIDV4,
        allowNull: true,
    }
}, {
    sequelize: config_1.db,
    tableName: "product",
});
