import { DataTypes, Model } from "sequelize";
import { db } from "../config";

export interface ReviewAttributes{
    name:string;
    rating:number;
    comment:string;
    user:string;
}


export interface ProductAttribute{
    id: string;
    name :string;
    description:string;
    category: string
    price: number;
    review: ReviewAttributes[];
    productType:string;
    rating: number;
    countInStock: number;
    numReviews: number;
    vendorId:string
}
//export the instance to use in checking if user exist
export class ProductInstance extends
Model<ProductAttribute>{}
ProductInstance.init({
    id: {
        type:DataTypes.UUIDV4,
        primaryKey:true,
        allowNull: false
    },
    name: {
        type:DataTypes.STRING,
        allowNull: true,
       },
    description:{
        type:DataTypes.STRING,
        allowNull: true,
    },
    price:{
        type:DataTypes.NUMBER,
        allowNull: true,
    },
    review:{
         type:DataTypes.ARRAY(DataTypes.JSON),
    },
    category:{
        type:DataTypes.STRING,
        allowNull: true
    },
    productType: {
        type:DataTypes.STRING,
        allowNull: true,
    },
    
    rating: {
        type:DataTypes.NUMBER,
        allowNull: true,
    },
    countInStock: {
        type:DataTypes.NUMBER,
        allowNull: false,
    },
    numReviews: {
        type:DataTypes.NUMBER,
        allowNull: false,
    },
    vendorId: {
        type:DataTypes.UUIDV4,
        allowNull: true,

}
},
{
    sequelize:db,
    tableName:"product",
})