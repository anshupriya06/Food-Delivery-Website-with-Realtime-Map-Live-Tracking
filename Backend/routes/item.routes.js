import express from 'express';
import isAuth from '../middlewares/isAuth.js';
import { addItems, editItems, deleteItems, getItemByCity } from '../controllers/item.controllers.js';
import upload from '../middlewares/multer.js';
import { getItemById } from '../controllers/item.controllers.js';

const itemRouter = express.Router();

// Public routes
itemRouter.get('/get-by-city/:city', getItemByCity);

// Protected routes
itemRouter.post('/add-item', isAuth, upload.single('image'), addItems);
itemRouter.post('/edit-item/:itemId', isAuth, upload.single('image'), editItems);
itemRouter.get('/get-item/:itemId', isAuth, getItemById);
itemRouter.delete('/delete/:itemId', isAuth, deleteItems); 

export default itemRouter;
