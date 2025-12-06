import { uploadToCloudinary } from "../utils/cloudinary.js";
import Shop from "../models/shop.model.js";
import Item from "../models/item.model.js";


export const addItems = async (req, res) => {
  try {
    const { name, foodType, price, category } = req.body;
    const ownerId = req.userId;
    
    console.log('Add item request:', { name, foodType, price, category, ownerId, hasFile: !!req.file });

    if (!ownerId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Convert price to number if it comes as a string from FormData
    const priceNum = typeof price === 'string' ? parseFloat(price) : Number(price);

    if (!name || !category || !foodType || !price) {
      return res.status(400).json({ message: "Name, category, foodType, and price are required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    let image;
    try {
      image = await uploadToCloudinary(req.file.path);
      if (!image) {
        return res.status(500).json({ message: "Failed to upload image" });
      }
    } catch (uploadError) {
      console.error('Cloudinary upload error:', uploadError);
      return res.status(500).json({ message: `Image upload failed: ${uploadError.message}` });
    }

    const shop = await Shop.findOne({ owner: ownerId });
    if (!shop) {
      return res.status(400).json({ message: "Shop not found" });
    }

    const item = await Item.create({
      name,
      shop: shop._id,
      category,
      price: priceNum,
      foodType,
      image,
    });

    shop.items.push(item._id);
    await shop.save();

    // Re-query the shop with populated fields to get sorted items
    const populatedShop = await Shop.findById(shop._id)
      .populate("owner")
      .populate({
        path: "items",
        options: { sort: { updatedAt: -1 } },
      });

    return res.status(201).json(populatedShop);

  } catch (error) {
    console.error('Add items error:', error);
    return res.status(500).json({ message: `add items error: ${error.message}` });
  }
}

export const editItems = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const { name, foodType, price, category } = req.body;

    const priceNum = typeof price === 'string' ? parseFloat(price) : Number(price);

    const updateData = {
      name,
      category,
      price: priceNum,
      foodType,
    };

    if (req.file) {
      const image = await uploadToCloudinary(req.file.path);
      if (image) {
        updateData.image = image;
      }
    }

    const item = await Item.findByIdAndUpdate(
      itemId,
      updateData,
      { new: true }
    );

    if (!item) {
      return res.status(400).json({ message: "Item not found" });
    }
    return res.status(200).json(item);
  } catch (error) {
    return res.status(500).json({ message: `edit items error: ${error.message}` });
  }
}

export const getItemById = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(400).json({ message: "Item not found" });
    }
    return res.status(200).json(item);
  } catch (error) {
    return res.status(500).json({ message: `get item by id error: ${error.message}` });
  }
}

export const deleteItems = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const ownerId = req.userId;

    if (!ownerId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(400).json({ message: "Item not found" });
    }

    const shop = await Shop.findOne({ owner: ownerId });
    if (!shop) {
      return res.status(400).json({ message: "Shop not found" });
    }

    if (item.shop.toString() !== shop._id.toString()) {
      return res.status(403).json({ message: "You don't have permission to delete this item" });
    }

    shop.items = shop.items.filter(id => id.toString() !== itemId);
    await shop.save();

    await Item.findByIdAndDelete(itemId);

    await shop.populate("items owner");
    return res.status(200).json(shop);
  } catch (error) {
    return res.status(500).json({ message: `delete items error: ${error.message}` });
  }
}

export const getItemByCity = async (req, res) => {
  try {
    const city = req.params.city;
    if(!city){
      return res.status(400).json({message: "City is required"});
    }
    const shops = await Shop.find({
      city: { $regex: new RegExp(`^${city}$`, "i") },
    });
    
    if (!shops || shops.length === 0) {
      return res.status(404).json({ message: "Shops not found in this city" });
    }
    
    const shopIds = shops.map(shop => shop._id);
    const items = await Item.find({ shop: { $in: shopIds } });
    return res.status(200).json(items);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `get items by city error: ${error.message}` });
  }
}