import React from 'react'
import Nav from './Nav'
import { categories } from '../category'
import CategoryCard from './CategoryCard'
import { IoIosArrowDropleftCircle, IoIosArrowDroprightCircle } from "react-icons/io";
import { useRef } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import useGetShopByCity from '../hooks/useGetShopByCity';
import FoodCard from './FoodCard';

function UserDashboard() {
  useGetShopByCity();
  const { currentCity, shopInMyCity, itemsInMyCity } = useSelector(state => state.user);
  const cateScrollRef = useRef(null);
  const shopScrollRef = useRef(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(false);
  const [showLeftShopButton, setShowLeftShopButton] = useState(false);
  const [showRightShopButton, setShowRightShopButton] = useState(false);

  const updateButton = (ref, setShowRight, setShowLeft) => {
    const element = ref.current;
    if (element) {
      const hasScroll = element.scrollWidth > element.clientWidth;
      if (hasScroll) {
        setShowLeft(element.scrollLeft > 0);
        setShowRight(element.scrollWidth > element.clientWidth + element.scrollLeft);
      } else {
        setShowLeft(false);
        setShowRight(false);
      }
    }
  }

  React.useEffect(() => {
    const updateButtons = () => {
      updateButton(cateScrollRef, setShowRightButton, setShowLeftButton);
      updateButton(shopScrollRef, setShowRightShopButton, setShowLeftShopButton);
    };

    const handleCateScroll = () => {
      updateButton(cateScrollRef, setShowRightButton, setShowLeftButton);
    };

    const handleShopScroll = () => {
      updateButton(shopScrollRef, setShowRightShopButton, setShowLeftShopButton);
    };

    const handleResize = () => {
      updateButtons();
    };

    const cateElement = cateScrollRef.current;
    const shopElement = shopScrollRef.current;

    if (cateElement) {
      cateElement.addEventListener('scroll', handleCateScroll);
      updateButton(cateScrollRef, setShowRightButton, setShowLeftButton);
    }

    if (shopElement) {
      shopElement.addEventListener('scroll', handleShopScroll);
      updateButton(shopScrollRef, setShowRightShopButton, setShowLeftShopButton);
    }

    window.addEventListener('resize', handleResize);

    return () => {
      if (cateElement) {
        cateElement.removeEventListener('scroll', handleCateScroll);
      }
      if (shopElement) {
        shopElement.removeEventListener('scroll', handleShopScroll);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [shopInMyCity]);



  const scrollHandler = (ref, direction) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === 'left' ? -200 : 200,
        behavior: 'smooth'
      });
    }
  }

  return (
    <div>
      <Nav />

      <div className='w-full max-w-6xl gap-5 flex flex-col items-start p-[10px]'>
        <h1 className='text-gray-800 text-2xl sm:text-3xl'>Inspiration for your first order</h1>
        <div className='w-full relative'>
          {showLeftButton && <button className='absolute left-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10 cursor-pointer transition-colors' onClick={() => scrollHandler(cateScrollRef, 'left')}>
            <IoIosArrowDropleftCircle size={32} />
          </button>}

          <div className='w-full flex overflow-x-auto gap-4 pb-2' ref={cateScrollRef}>
            {categories.map((cate, index) => (
              <CategoryCard name={cate.category} image={cate.image} key={index} />
            ))}
          </div>
          {showRightButton &&
            <button className='absolute right-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10 cursor-pointer transition-colors' onClick={() => scrollHandler(cateScrollRef, 'right')}>
              <IoIosArrowDroprightCircle size={32} />
            </button>}

        </div>

      </div>

      {currentCity && (
        <div className='w-full max-w-6xl gap-5 flex flex-col items-start p-[10px]'>
          <h1 className='text-gray-800 text-2xl sm:text-3xl'>Best Shop in {currentCity}</h1>
          <div className='w-full relative'>
            {showLeftShopButton && <button className='absolute left-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10 cursor-pointer transition-colors' onClick={() => scrollHandler(shopScrollRef, 'left')}>
              <IoIosArrowDropleftCircle size={32} />
            </button>}

            <div className='w-full flex overflow-x-auto gap-4 pb-2' ref={shopScrollRef}>
              {shopInMyCity?.map((shop, index) => (
                <CategoryCard name={shop.name} image={shop.image} key={index} />
              ))}
            </div>
            {showRightShopButton &&
              <button className='absolute right-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10 cursor-pointer transition-colors' onClick={() => scrollHandler(shopScrollRef, 'right')}>
                <IoIosArrowDroprightCircle size={32} />
              </button>}

          </div>
        </div>
      )}

      <div className='w-full max-w-6xl gap-5 flex flex-col items-start p-[10px]'>
        <h1 className='text-gray-800 text-2xl sm:text-3xl'>Suggested Food Items</h1>
        <div className='w-full h-auto flex flex-wrap gap-[20px] justify-center'>
          {itemsInMyCity?.map((item, index) => (
           <FoodCard key={index} data={item} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default UserDashboard