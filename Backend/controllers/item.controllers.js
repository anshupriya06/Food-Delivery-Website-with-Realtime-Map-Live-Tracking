import { uploadToCloudinary } from "../utils/cloudinary.js";
import Shop from "../models/shop.model.js";
import Item from "../models/item.model.js";


export const addItems = async (req, res) => {
  try {
    const { name, foodType, price, category } = req.body;
    let image;
    if (req.file) {
      image = await uploadToCloudinary(req.file.path);
    }

    const shop = await Shop.findOne({ owner: req.user._id });
    if (!shop) {
      return res.status(400).json({ message: "Shop not found" });
    }
    const item = await Item.create({
      name,
      shop: shop._id,
      category,
      price,
      foodType,
    });
    shop.items.push(item._id);
    return res.status(201).json(item);

  } catch (error) {
    return res.status(500).json({ message: `add items error: ${error.message}` });
  }
}

export const editItems = async (req, res) => {
    try {
      const itemId = req.params.itemId;
        const { name, foodType, price, category } = req.body;
        let image;
        if (req.file) {
            image = await uploadToCloudinary(req.file.path);
        }
        const item = await Item.findById(itemId, {
            name,
            image,
            category,
            price,
            foodType,
        }, { new: true });

        if (!item) {
            return res.status(400).json({ message: "Item not found" });
        }
        return res.status(200).json(item);
  } catch (error) {
     return res.status(500).json({ message: `edit items error: ${error.message}` });
  }
}