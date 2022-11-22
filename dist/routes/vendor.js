"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const vendorController_1 = require("../controller/vendorController");
const authorization_1 = require("../middleware/authorization");
const router = express_1.default.Router();
router.post('/login', vendorController_1.vendorLogin);
router.post('/create-product', authorization_1.authVendor, vendorController_1.createProduct);
router.get('/get-profile', authorization_1.authVendor, vendorController_1.vendorProfile);
router.delete('/delete-product/:productid', authorization_1.authVendor, vendorController_1.deleteProduct);
exports.default = router;
