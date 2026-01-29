import React from 'react'
import { IoLocationSharp } from "react-icons/io5";
import { IoMdSearch } from "react-icons/io";
import { FaCartShopping } from "react-icons/fa6";
import { useSelector } from 'react-redux';
import { RxCross2 } from "react-icons/rx";
import axios from 'axios';
import { setUserData } from '../redux/userSlice';
import { useDispatch } from 'react-redux';
import { FaPlus } from "react-icons/fa6"
import { TbReceiptRupee } from "react-icons/tb";
import { useNavigate } from 'react-router-dom';


const serverUrl = import.meta.env.VITE_SERVERURL;

function Nav() {
    const { userData, currentCity, cartItems } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const { myShopData } = useSelector((state) => state.owner);
    const userInitial = userData?.fullName?.charAt(0)?.toUpperCase() ?? '';
    const [popup, setPopup] = React.useState(false);
    const [showSearch, setShowSearch] = React.useState(false);
    const dispatch = useDispatch();

    const handleLogout = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/v1/auth/signout`,
                { withCredentials: true });
            dispatch(setUserData(null));
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <div className='fixed top-3 left-0 w-full z-[9999] bg-[#fff9f6]'>
            <div className='max-w-[1800px] mx-auto h-[80px] flex items-center justify-center md:justify-center gap-[30px] px-[20px]'>

                {showSearch && userData.role == "user" && <div className='w-[90%] h-[70px] bg-white shadow-xl rounded-lgn flex fixed top-[80px] left-[5%] items-center gap-[20px] md:hidden z-[9999]'>

                    {/* Location section */}
                    <div className='flex items-center w-[30%] overflow-hidden gap-[10px] px-[10px] border-r-[2px] border-gray-400'>
                        <IoLocationSharp size={25} className='text-[#ff4d2d] cursor-pointer' />
                        <div className='w-[80%] text-gray-600 truncate'>{currentCity}</div>
                    </div>

                    {/* Search input */}
                    <div className='w-[80%] flex items-center gap-[20px]'>
                        <IoMdSearch size={25} className='text-[#ff4d2d] cursor-pointer' />
                        <input
                            type="text"
                            placeholder='search delicious foods...'
                            className='px-[10px] text-gray-700 outline-0 w-full'
                        />
                    </div>

                </div>}

                {/* logo */}
                <h1 className='text-3xl font-bold mb-2  text-[#ff4d2d]'>Tathastu</h1>

                {/* search */}
                {userData.role == "user" && <div className='md:w-[60%] lg:w-[40%] h-[70px] bg-white shadow-xl rounded-lg md:flex hidden items-center gap-[20px]'>

                    {/* Location section */}
                    <div className='flex items-center w-[30%] overflow-hidden gap-[10px] px-[10px] border-r-[2px] border-gray-400'>
                        <IoLocationSharp size={25} className='text-[#ff4d2d] cursor-pointer' />
                        <div className='w-[80%] text-gray-600 truncate'>{currentCity}</div>
                    </div>

                    {/* Search input */}
                    <div className='w-[80%] flex items-center gap-[20px]'>
                        <IoMdSearch size={25} className='text-[#ff4d2d] cursor-pointer' />
                        <input
                            type="text"
                            placeholder='search delicious foods...'
                            className='px-[10px] text-gray-700 outline-0 w-full'
                        />
                    </div>

                </div>}


                <div className='flex items-center gap-[20px]'>
                    {userData.role == "user" && (showSearch ? <RxCross2 size={25} className='text-[#ff4d2d] md:hidden cursor-pointer' onClick={() => setShowSearch(false)} /> : <IoMdSearch size={25} className='text-[#ff4d2d] md:hidden cursor-pointer' onClick={() => setShowSearch(true)} />)}

                    {/* Add food item for owner dash board */}
                    {userData.role == "owner" ? <> <div className='cursor-pointer'>
                        {myShopData && <>
                        <button className='hidden md:flex items-center p-2 gap-1 rounded-full bg-[#ff4d2d]/10 text-[#ff4d2d] font-medium text-sm cursor-pointer' onClick={() => navigate("/add-item")}>
                            <FaPlus size={20} />
                            <span>Add Food Item</span>
                        </button>

                        <button className='md:hidden flex items-center p-2 rounded-full bg-[#ff4d2d]/10 text-[#ff4d2d] font-medium text-sm cursor-pointer'  onClick={() => navigate("/add-item")}>
                            <FaPlus size={20} />
                        </button>
                        </>}
                        
                    </div>

                    <div className=' hidden md:flex items-center gap-2 cursor-pointer relative px-3 py-1 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] font-medium'>
                        <TbReceiptRupee size={20} />
                        <span className='font-medium'>My Orders</span>
                        <span className='absolute -right-2 -top-2 text-xs font-bold text-white rounded-full bg-[#ff4d2d] px-[6px] py-[2px]'>0</span>
                    </div>
                    <div className=' md:hidden flex items-center gap-2 cursor-pointer relative px-3 py-1 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] font-medium'>
                        <TbReceiptRupee size={20} />
                        <span className='absolute -right-2 -top-2 text-xs font-bold text-white rounded-full bg-[#ff4d2d] px-[6px] py-[2px]'>0</span>
                    </div>
                    </>

                        :
                        <>

                            {/* Cart */}
                            {userData.role == "user" && <div className='relative cursor-pointer' onClick={()=> navigate("/cart")}>
                                <FaCartShopping size={25} className='text-[#ff4d2d] cursor-pointer' />
                                <span className='absolute top-[-12px] right-[-9px] text-[#ff4d2d]'>{cartItems.length}</span>
                            </div>}

                            {/* orders */}
                            <button className='hidden md:block px-3 py-1 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] font-medium text-sm'>
                                My Orders
                            </button>
                        </>
                    }



                    {/* User */}
                    <div className='w-[40px] h-[40px] rounded-full flex items-center justify-center bg-[#ff4d2d] cursor-pointer text-[18px] shadow-xl font-semibold text-white' onClick={() => setPopup(prev => !prev)} >
                        {userInitial}
                    </div>

                    {popup && <div className='fixed top-[80px] right-[10px] md:right-[10%] lg:right-[25%] w-[180px] bg-white shadow-2xl rounded-xl p-[20px] flex flex-col gap-[10px] z-[9999]'>
                        <div className='font-semibold text-[17px] text-gray-700'>{userData?.fullName}</div>
                        {userData.role == "user" && <div className='md:hidden font-semibold text-[17px] text-gray-700 cursor-pointer'>My Orders</div>}
                        
                        <div className='font-semibold text-[17px] text-[#ff4d2d] cursor-pointer' onClick={handleLogout}>Logout</div>
                    </div>
                    }
                </div>
                <div />
            </div>
        </div>
    )
}

export default Nav
