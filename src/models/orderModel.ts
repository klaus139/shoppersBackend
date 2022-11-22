import { DataTypes, Model } from "sequelize";
import { db } from "../config";

export interface orderItemsAttributes{
    name: string;
    qty: number;
    image: string;
    price: number;
    product: string;

}

export interface OrderAttributes{
    id: string;
    orderItems: orderItemsAttributes[];
    shippingAddress: string;
    paymentMethod: string;
    paymentResult: string;
    taxPrice: number;
    shippingPrice: number;
    totalPrice: number;
    isPaid: boolean;
    paidAt: Date;
    isDelivered: boolean;
    deliveredAt: Date;

}

export class OrderInstance extends
Model<OrderAttributes>{}

OrderInstance.init(
    {
        id: {
            type: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        orderItems: {
            type: DataTypes.ARRAY(DataTypes.JSON),
            allowNull: false,
        },
        shippingAddress: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        paymentMethod: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'Paypal',
        },
        paymentResult: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        taxPrice: {
            type: DataTypes.NUMBER,
            allowNull: false,
            defaultValue: 0.0,
        },
        shippingPrice: {
            type: DataTypes.NUMBER,
            allowNull: false,
            defaultValue: 0.0,
        },
        totalPrice: {
            type: DataTypes.NUMBER,
            allowNull: false,
            defaultValue: 0.0,
        },
        isPaid: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        paidAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        isDelivered: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        deliveredAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        sequelize: db,
        tableName: 'orders',
    }
);