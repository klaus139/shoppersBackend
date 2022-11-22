import express from 'express';
import { createProduct, deleteProduct, vendorLogin, vendorProfile } from '../controller/vendorController';
import { authVendor } from '../middleware/authorization';

const router = express.Router();

router.post('/login', vendorLogin);
router.post('/create-product', authVendor, createProduct);
router.get('/get-profile', authVendor, vendorProfile);
router.delete('/delete-product/:productid', authVendor, deleteProduct)

export default router;