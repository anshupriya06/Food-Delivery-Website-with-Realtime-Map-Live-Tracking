import React, { useEffect } from 'react';
import axios from 'axios';
import { serverUrl } from '../App';
import { useDispatch } from 'react-redux';
import { setUserData, setUserLoading } from '../redux/userSlice.js';

function useGetCurrentUser() {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/v1/user/current`, {
                    withCredentials: true
                });

                if (result.data) {
                    dispatch(setUserData(result.data));
                } else {
                    dispatch(setUserData(null));
                }
            } catch (error) {
                if (error?.response?.status === 401) {
                    dispatch(setUserData(null));
                } else {
                    console.error('Error fetching current user:', error);
                    dispatch(setUserData(null));
                }
            } finally {
                
                dispatch(setUserLoading(false));
            }
        };

        fetchCurrentUser();
    }, [dispatch]);
}

export default useGetCurrentUser;
