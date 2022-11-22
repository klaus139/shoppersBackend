"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderInstance = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("../config");
class OrderInstance extends sequelize_1.Model {
}
exports.OrderInstance = OrderInstance;
OrderInstance.init({
    id: {
        type: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    orderItems: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.JSON),
        allowNull: false,
    },
    shippingAddress: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    paymentMethod: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Paypal',
    },
    paymentResult: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    taxPrice: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: false,
        defaultValue: 0.0,
    },
    shippingPrice: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: false,
        defaultValue: 0.0,
    },
    totalPrice: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: false,
        defaultValue: 0.0,
    },
    isPaid: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    paidAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    isDelivered: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    deliveredAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
}, {
    sequelize: config_1.db,
    tableName: 'orders',
});
