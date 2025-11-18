import React from 'react'
import { useEffect } from 'react';
import axios from 'axios';
import { serverUrl } from '../App';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice.js';

function useGetCurrentUser() {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/v1/user/current`, { withCredentials: true });
                dispatch(setUserData(result.data));
            } catch (error) {
                if (error.response?.status === 401) {
                    console.log('User not authenticated');
                    return;
                }
                
                if (error.code !== 'ERR_NETWORK' && error.code !== 'ERR_CONNECTION_REFUSED') {
                    console.error('Error fetching current user:', error.response?.data?.message || error.message);
                    console.error('Status:', error.response?.status);
                    console.error('Response data:', error.response?.data);
                }
            }
        };

        fetchCurrentUser();
    }, [dispatch]);

   
}

export default useGetCurrentUser