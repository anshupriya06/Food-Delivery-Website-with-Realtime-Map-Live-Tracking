import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setShopsInMyCity, setUserData } from '../redux/userSlice'

function useGetShopByCity() {
    const dispatch=useDispatch()
    const {currentCity}=useSelector(state=>state.user)
  useEffect(()=>{
    // Only fetch shops if currentCity exists
    if (!currentCity) {
      return;
    }

    const fetchShops=async () => {
      try {
        const result=await axios.get(`${serverUrl}/api/v1/shop/get-by-city/${encodeURIComponent(currentCity)}`,{withCredentials:true})
        dispatch(setShopsInMyCity(result.data))
        console.log(result.data)
      } catch (error) {
        // Only log error if it's not a 404 (no shops found in city)
        if (error?.response?.status !== 404) {
          console.log(error)
        }
      }
    }
    fetchShops()
  },[currentCity, dispatch])
}

export default useGetShopByCity
