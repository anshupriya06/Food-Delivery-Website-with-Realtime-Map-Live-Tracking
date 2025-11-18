import React from 'react'
import { IoLocationSharp } from "react-icons/io5";
import { IoMdSearch } from "react-icons/io";

function Nav() {
    return (
        <div className='fixed top-0 left-0 w-full z-[9999] bg-[#fff9f6]'>
            <div className='max-w-[1100px] mx-auto h-[80px] flex items-center justify-center md:justify-center gap-[30px] px-[20px]'>
                <h1 className='text-3xl font-bold mb-2 text-[#ff4d2d]'>Tathastu</h1>

                <div className='md:w-[60%] lg:w-[40%] h-[70px] bg-white shadow-xl rounded-lg flex items-center gap-[20px]'>

                    {/* Location section */}
                    <div className='flex items-center w-[30%] overflow-hidden gap-[10px] px-[10px] border-r-[2px] border-gray-400'>
                        <IoLocationSharp size={25} className='text-[#ff4d2d] cursor-pointer' />
                        <div className='w-[80%] text-gray-600 truncate'>Jaipur</div>
                    </div>

                    {/* Search input */}
                    <div className='w-[80%] flex items-center gap-[20px]'>
                        <IoMdSearch size={25} className='text-[#ff4d2d] cursor-pointer' />
                        <input
                            type="text"
                            placeholder='Search delicious food'
                            className='px-[10px] text-gray-700 outline-0 w-full'
                        />
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Nav
