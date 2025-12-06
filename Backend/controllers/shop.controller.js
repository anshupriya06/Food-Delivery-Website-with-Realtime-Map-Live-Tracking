import { uploadToCloudinary } from "../utils/cloudinary.js";
import Shop from "../models/shop.model.js";

export const createEditShop = async (req, res) => {
  try {
    const { name, address, city, state } = req.body;
    const ownerId = req.userId;
    if (!ownerId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    let image;
    if (req.file) {
      image = await uploadToCloudinary(req.file.path);
    }
    let shop = await Shop.findOne({ owner: ownerId });
    if (!shop) {
      const shopData = {
        name,
        address,
        city,
        state,
        owner: ownerId,
      };
      if (image) {
        shopData.image = image;
      }
      shop = await Shop.create(shopData);
    } else {
      const updateData = {
        name,
        address,
        city,
        state,
      };
      if (image) {
        updateData.image = image;
      }
      shop = await Shop.findByIdAndUpdate(shop._id, updateData, { new: true });
    }

    await shop.populate("owner items");
    return res.status(201).json(shop);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `create shop error: ${error.message}` });
  }
};

export const getMyShop = async (req, res) => {
  try {
    const ownerId = req.userId;
    if (!ownerId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const shop = await Shop.findOne({ owner: ownerId })
      .populate("owner")
      .populate({
        path: "items",
        options: { sort: { updatedAt: -1 } },
      });
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }
    return res.status(200).json(shop);
  } catch (error) {
    console.error("getMyShop error", error);
    return res
      .status(500)
      .json({ message: `get my shop error: ${error.message}` });
  }
};

export const getShopByCity = async (req, res) => {
  try {
    const { city } = req.params;
    const shops = await Shop.find({
      city: { $regex: new RegExp(`^${city}$`, "i") },
    }).populate("items");
    if (!shops) {
      return res.status(404).json({ message: "Shops not found" });
    }
    return res.status(200).json(shops);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `get my shop error: ${error.message}` });
  }
};
