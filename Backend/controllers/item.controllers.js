import { uploadToCloudinary } from "../utils/cloudinary.js";
import Shop from "../models/shop.model.js";
import Item from "../models/item.model.js";


export const addItems = async (req, res) => {
  try {
    const { name, foodType, price, category } = req.body;
    const ownerId = req.userId;

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
      price,
      foodType,
      image,
    });

    shop.items.push(item._id);
    await shop.populate("items owner");
    console.log(shop)
    await shop.save();

    return res.status(201).json(item);

  } catch (error) {
    return res.status(500).json({ message: `add items error: ${error.message}` });
  }
}

export const editItems = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const { name, foodType, price, category } = req.body;

    const updateData = {
      name,
      category,
      price,
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