import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setCity } from '../redux/userSlice.js';

function useGetCity() {
    const dispatch = useDispatch();
    const apiKey = import.meta.env.VITE_GEOAPIKEY;
    
    useEffect(() => {
        if (!apiKey) {
            console.error('VITE_GEOAPIKEY is not defined');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const result = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${apiKey}`, {
                        withCredentials: false
                    });
                    
                    const resultData = result?.data?.results?.[0];
                    
                    if (!resultData) {
                        console.error('No results found in Geoapify API response');
                        dispatch(setCity(null));
                        return;
                    }
                    
                    console.log('Geoapify API Response:', resultData);
                    console.log('Properties:', resultData?.properties);
                    
                    const cityName = resultData?.properties?.city || 
                                   resultData?.properties?.address?.city ||
                                   resultData?.properties?.name ||
                                   resultData?.city ||
                                   resultData?.properties?.town ||
                                   resultData?.properties?.municipality ||
                                   resultData?.properties?.county ||
                                   null;
                    
                    if (cityName) {
                        dispatch(setCity(cityName));
                        console.log('✅ City fetched successfully:', cityName);
                    } else {
                        const formatted = resultData?.properties?.formatted;
                        if (formatted) {
                            const parts = formatted.split(',');
                            const extractedCity = parts[0]?.trim() || null;
                            if (extractedCity) {
                                dispatch(setCity(extractedCity));
                                console.log('✅ City extracted from formatted address:', extractedCity);
                            } else {
                                console.warn('⚠️ Could not extract city from formatted address');
                                dispatch(setCity(null));
                            }
                        } else {
                            console.warn('⚠️ City not found in API response. Full properties:', resultData?.properties);
                            dispatch(setCity(null));
                        }
                    }
                } catch (error) {
                    console.error('Error fetching city:', error);
                    dispatch(setCity(null));
                }
            },
            (error) => {
                console.error('Error getting geolocation:', error);
                dispatch(setCity(null));
            }
        );
    }, [dispatch, apiKey]);
}

export default useGetCity