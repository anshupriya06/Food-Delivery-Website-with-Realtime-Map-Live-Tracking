import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setItemsInMyCity } from '../redux/userSlice'

function useGetItemsByCity() {
    const dispatch=useDispatch()
    const {currentCity}=useSelector(state=>state.user)
  useEffect(()=>{
    if (!currentCity) {
      return;
    }

    const fetchItems=async () => {
      try {
        const result=await axios.get(`${serverUrl}/api/v1/item/get-by-city/${encodeURIComponent(currentCity)}`,{withCredentials:true})
        dispatch(setItemsInMyCity(result.data))
        console.log(result.data)
      } catch (error) {
        if (error?.response?.status !== 404) {
          console.log(error)
        }
      }
    }
    fetchItems()
  },[currentCity, dispatch])
}

export default useGetItemsByCity