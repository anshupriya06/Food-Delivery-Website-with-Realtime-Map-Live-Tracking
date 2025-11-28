import React from 'react'
import { IoArrowBack } from "react-icons/io5";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaUtensils } from "react-icons/fa";
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setMyShopData } from '../redux/ownerSlice.js';
import { serverUrl } from '../App';



function CreateEditShop() {
  const navigate = useNavigate();

  const { myShopData } = useSelector(state => state.owner);
  const dispatch = useDispatch();
  const { currentCity, currentState, currentAddress } = useSelector(state => state.user);

  const [name, setName] = React.useState(myShopData?.name || "");
  const [address, setAddress] = React.useState(myShopData?.address || currentAddress || "");
  const [city, setCity] = React.useState(myShopData?.city || currentCity || "");
  const [state, setState] = React.useState(myShopData?.state || currentState || "");
  const [frontendImage, setFrontendImage] = React.useState(myShopData?.image || null);
  const [backendImage, setBackendImage] = React.useState(null);

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("address", address);
      formData.append("city", city);
      formData.append("state", state);

      if (backendImage) {
        formData.append("image", backendImage);
      }

      const result = await axios.post(`${serverUrl}/api/v1/shop/create-edit`, formData, { withCredentials: true });

      dispatch(setMyShopData(result.data));
      console.log(result.data)
      navigate("/");
    } catch (error) {
      console.log(error)
    }
  };


  React.useEffect(() => {
    if (!myShopData) {
      setCity(currentCity || "");
      setState(currentState || "");
      setAddress(currentAddress || "");
    }
  }, [currentCity, currentState, currentAddress]);

  return (
    <div className='flex justify-center flex-col items-center p-6 bg-gradient-to-br from-orange-50 relative to-white min-h-screen'>
      {/* Back button  */}
      <div className='absolute top-[20px] left-[20px] z-[10] mb-[10px]' onClick={() => navigate("/")}>
        <IoArrowBack size={35} className='text-[#ff4d2d]' />
      </div>
      {/* Form  */}
      <div className='max-w-lg w-full bg-white shadow-xl rounded-2xl p-8 border border-orange-100 '>
        {/* Heading */}
        <div className='flex flex-col items-center mb-6'>
          <div className='bg-orange-100 p-4 rounded-full mb-4'>
            <FaUtensils className='text-[#ff4d2d] w-16 h-16' />
          </div>
          <div className='text-3xl font-extrabold text-gray-900'>
            {myShopData ? "Edit Shop" : "Add Shop"}
          </div>
        </div>
        <div>
          {/* Form fields for creating or editing shop would go here */}
          <form className="space-y-5" onSubmit={handleSubmit} >

            {/* name */}
            <div>
              <label className='block text-sm text-gray-700 mb-1'>Name</label>
              <input type="text" placeholder='Enter Shop Name' className='w-full px-4 py-2 border rounded-lg  focus:outline-none focus:ring-2 focus:ring-orange-500' onChange={(e) => setName(e.target.value)}
                value={name} />
            </div>
            {/* Shop Image */}
            <div>
              <label className='block text-sm text-gray-700 mb-1' >Shop Image</label>
              <input type="file" accept='image/*' placeholder='Enter Shop Name' className='w-full px-4 py-2 border rounded-lg  focus:outline-none focus:ring-2 focus:ring-orange-500' onChange={handleImage} />
              {frontendImage && <div className='mt-4'>
                <img src={frontendImage} className='w-full h-48 object-cover rounded-lg border' alt="" />
              </div>}

            </div>
            {/* State and city */}
            <div className='grid grid-cols-1  md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm text-gray-700 mb-1' >State</label>
                <input type="text" placeholder='Enter State' className='w-full px-4 py-2 border rounded-lg  focus:outline-none focus:ring-2 focus:ring-orange-500' onChange={(e) => setState(e.target.value)} value={state} />
              </div>
              <div>
                <label className='block text-sm text-gray-700 mb-1' >City</label>
                <input type="text" placeholder='Enter City' className='w-full px-4 py-2 border rounded-lg  focus:outline-none focus:ring-2 focus:ring-orange-500' onChange={(e) => setCity(e.target.value)} value={city} />
              </div>
            </div>
            {/* Address */}
            <div>
              <label className='block text-sm text-gray-700 mb-1' >Address</label>
              <input type="text" placeholder='Enter Shop Address' className='w-full px-4 py-2 border rounded-lg  focus:outline-none focus:ring-2 focus:ring-orange-500' onChange={(e) => setAddress(e.target.value)} value={address} />
            </div>
            {/* Save button */}
            <button className='w-full bg-[#ff4d2d] text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-orange-600 hover:shadow-lg transition-all duration-200 cursor-pointer'>
              Save
            </button>
          </form>
        </div>
      </div>


    </div>
  )
}

export default CreateEditShop