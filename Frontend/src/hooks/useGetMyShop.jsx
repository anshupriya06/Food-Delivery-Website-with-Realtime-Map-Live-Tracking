import React, { useEffect } from 'react';
import axios from 'axios';
import { serverUrl } from '../App';
import { useDispatch } from 'react-redux';
import { setUserData, setUserLoading } from '../redux/userSlice.js';
import { setMyShopData } from '../redux/ownerSlice.js';
import { useSelector } from 'react-redux';

function useGetMyShop() {
    const dispatch = useDispatch();
    const {userData} = useSelector(state => state.user);
    useEffect(() => {
        if (!userData || userData.role !== 'owner') {
            return;
        }

        const fetchShop = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/v1/shop/get-my`, {
                    withCredentials: true,
                });
                dispatch(setMyShopData(result.data));

            } catch (error) {
                if (error?.response?.status !== 404) {
                    console.log(error);
                }
            };
        }

        fetchShop();
    }, [userData, dispatch]);
}

export default useGetMyShop;
