import { uploadToCloudinary } from "../utils/cloudinary.js";
import Shop from "../models/shop.model.js";
import Item from "../models/item.model.js";


export const addItems = async (req, res) => {
  try {
    const { name, foodType, price, category } = req.body;
    const ownerId = req.userId;
    
    // Convert price to number if it comes as a string from FormData
    const priceNum = typeof price === 'string' ? parseFloat(price) : Number(price);

    if (!ownerId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let image;
    if (req.file) {
      image = await uploadToCloudinary(req.file.path);
    }

    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }

    const shop = await Shop.findOne({ owner: ownerId })
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

    await shop.populate("owner").populate(
      {
        path:"items",
        options:{sort:{updatedAt:-1}}
      }
    )
    return res.status(201).json(shop);

  } catch (error) {
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