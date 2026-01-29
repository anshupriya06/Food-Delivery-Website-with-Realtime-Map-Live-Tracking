import React from 'react'
import { FaLeaf } from "react-icons/fa";
import { GiChickenLeg } from "react-icons/gi";
import { FaStar } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/userSlice';
import { useSelector } from 'react-redux';

function FoodCard({ data }) {
    const [quantity, setQuantity] = React.useState(0);
    const dispatch = useDispatch();
    const {cartItems} = useSelector(state => state.user);

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                   ((i <= rating) ? (<FaStar className='text-yellow-500 text-lg'/>) : (<FaRegStar className='text-yellow-500 text-lg' />)))
        } return stars;
    }

    const handleIncrement = () => {
        const newQty = quantity + 1;
        setQuantity(newQty);
    }

    const handleDecrement = () => {
        if (quantity > 0) {
            const newQty = quantity - 1;
            setQuantity(newQty);
        }   
    }
    return (
        <div className='w-[250px] rounded-2xl border-2 border-[#ff4d2d] bg-white shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col '>
            <div className='relative w-full h-[170px] flex justify-center items-center bg-white'>
                <div className='top-3 bg-white rounded-full absolute right-3 p-1 shadow'>
                    {data.foodType === 'Veg' ? (
                        <FaLeaf color='green' size={20} />
                    ) : (
                        <GiChickenLeg color='red' size={20} />
                    )}
                </div>
                <img src={data.image} className='w-full h-full object-cover transition-transform duration-300 hover:scale-105' />
            </div>
            <div className='p-4 flex-1 flex flex-col'>
                <h1 className='font-semibold text-gray-800 truncate text-base'>{data.name}</h1>
                <div className='flex items-center gap-1 mt-1'>
                    {renderStars(data.rating?.average || 0)}
                    <span>
                        { data.rating?.count || 0} 
                    </span>
                </div>
            </div>


                <div className='flex items-center justify-between mt-auto p-3'>
                    <span className='text-lg font-bold text-grey-900'>
                        ₹ {data.price}
                    </span>
                    <div className='flex items-center border rounded-full overflow-hidden shadow-sm'>
                        <button className='px-2 py-1 hover:bg-gray-100 transition' onClick={handleDecrement}>
                            <FaMinus size={12} />
                        </button>
                        <span className='px-2'>{quantity}</span>
                        <button className='px-2 py-1 hover:bg-gray-100 transition' onClick={handleIncrement}>
                            <FaPlus size={12}/>
                        </button>
                        <button className={`${cartItems.some(i => i.id === data._id) ?'bg-gray-800' :  'bg-[#ff4d2d]'} text-white px-3 py-2 transition-colors`} onClick={() => {
                            {  quantity > 0 ?
                                dispatch(addToCart({
                                id: data._id,
                                name: data.name,
                                price: data.price,
                                quantity: quantity,
                                image: data.image,
                                shop: data.shop,
                                foodType: data.foodType,
                            })) : null
                            }
                        }}>
                            <FiShoppingCart size={16}/>
                        </button>
                    </div>
                </div>
        </div>
    )
}

export default FoodCard