import { uploadToCloudinary } from "../utils/cloudinary.js";
import Shop from "../models/shop.model.js";

export const createEditShop = async (req, res) => {
  try {
    const { name, address, city, state } = req.body;
    let image;
    if (req.file) {
      image = await uploadToCloudinary(req.file.path);
    }
    let shop = await Shop.findOne({ owner: req.user._id });
    if(!shop){
        shop = await Shop.create({
        name,
        image,
        address,
        city,
        state,
        owner: req.user._id,
    });
    } else {
        shop = await Shop.findByIdAndUpdate(shop._id, {
        name,
        image,
        address,
        city,
        state,
        owner: req.user._id,
    }, { new: true });
    }

    await shop.populate("owner");
    return res.status(201).json(shop);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `create shop error: ${error.message}` });
  }
};


