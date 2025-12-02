import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Shop from '../models/shop.model.js';

const run = async () => {
  await connectDB();
  const shops = await Shop.find().sort({ createdAt: -1 }).limit(5);
  console.log(
    shops.map((shop) => ({
      id: shop._id,
      name: shop.name,
      image: shop.image,
      owner: shop.owner,
      createdAt: shop.createdAt,
    }))
  );
  await mongoose.disconnect();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

