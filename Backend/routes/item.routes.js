import express from 'express';
import isAuth from '../middlewares/isAuth.js';
import { addItems, editItems } from '../controllers/item.controllers.js';
import upload from '../middlewares/multer.js';


const itemRouter = express.Router();

itemRouter.post('/add-item', isAuth, upload.single('image'), addItems);
itemRouter.post('/edit-item/:itemId', isAuth, upload.single('image'), editItems);


export default itemRouter;
