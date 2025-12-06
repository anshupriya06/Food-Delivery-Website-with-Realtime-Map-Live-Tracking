import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
        required: true
    },
    category: {
        type: String,
        enum : [
            'Beverages', 
            'Snacks', 
            'Desserts',
            'Salads',
            'Soups',
            'Pasta',
            'Pizza',
            'Burgers',
            'Sandwiches',
            'Wraps',
            'Fries',
            'Rice Dishes',
            'Seafood',
            'Grilled Items',
            'Sushi',
            'Tacos',
            'Others'    
        ],
        required: true
    },
    price: {
        type: Number,
        min: 0,
        required: true
    },
    foodType: {
        type: String,
        enum: ['Veg', 'Non-Veg'],
        required: true
    },
    reating: {
        average: {
            type: Number,
            default: 0
        },
        count: {
            type: Number,
            default: 0
        }
    }

}, { timestamps: true });   

const Item = mongoose.model('Item', itemSchema);

export default Item;