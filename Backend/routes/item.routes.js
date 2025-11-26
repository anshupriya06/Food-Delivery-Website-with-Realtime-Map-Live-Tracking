import express from 'express';
import isAuth from '../middlewares/isAuth.js';
import { addItems } from '../controllers/item.controllers.js';

const itemRouter = express.Router();

itemRouter.get('/add-item', isAuth, addItems);


export default itemRouter;