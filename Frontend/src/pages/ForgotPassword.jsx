import React from 'react'
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../App';

export default function ForgotPassword() {
    const primaryColor = "#ff4d2d";
    const navigate = useNavigate();

    const [step, setStep] = React.useState(1);
    const [email, setEmail] = React.useState("");
    const [otp, setOtp] = React.useState("");
    const [newPassword, setNewPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [error, setError] = React.useState(null);
    const [Loading, setLoading] = React.useState(false);

    const handleSendOtp = async() => {
        setError(null);
        setLoading(true);
        try {

            const result = await axios.post(`${serverUrl}/api/v1/auth/send-otp`, { email },{ withCredentials: true });
            setStep(2);
            setError("")
            console.log(result)
            setLoading(false);
        } catch (error) {
            setError(error?.response?.data?.message || "Failed to send OTP.");
            console.error(error);
            setLoading(false);
        }
    }

    const handleVerifyOtp = async() => {
        setError(null);
        setLoading(true);
        try {
            const result = await axios.post(`${serverUrl}/api/v1/auth/verify-otp`, { email, otp },{ withCredentials: true });
            setStep(3);
            setError("")
            console.log(result)
            setLoading(false);
        } catch (error) {
            setError(error?.response?.data?.message || "Failed to verify OTP.");
            console.error(error);
            setLoading(false);
        }
    }
    const handleResetPassword = async() => {
        
        if (newPassword !== confirmPassword) {
            alert("Password does not match");
            return null;
        }
        setError(null);
        setLoading(true);
        try {
            const result = await axios.post(`${serverUrl}/api/v1/auth/reset-password`, { email , newPassword },{ withCredentials: true });
            navigate("/signin");
            console.log(result)
            setError("")
            setLoading(false);
        } catch (error) {
            setError(error?.response?.data?.message || error.message);
            setLoading(false);
        }
    }
                


    return (
        <div className='flex w-full items-center justify-center min-h-screen p-4'
            style={{ backgroundColor: "#fff9f6" }}>
            <div className='bg-white rounded-xl shadow-lg w-full max-w-md p-8'>
                <div className='flex items-center gap-4 mb-4 '>
                    <IoArrowBack className='text-[#ff4d2d] size={20} cursor-pointer' onClick={() => navigate(-1)} />
                    <h1 className='text-2xl font-bold text-center text-[#ff4d2d]'>Forgot Password</h1>
                </div>
                {step === 1 && (
                    <div>
                        <div className='mb-6'>
                            <label htmlFor="email" className='block text-gray-700 font-medium mb-1'>Email</label>
                            <input
                                type="email" id="email"
                                name="email"
                                placeholder="Enter your email"
                                className="w-full px-3 py-2 border-[1px] border-gray-200 rounded-lg focus:outline-none "
                                onChange={(e) => setEmail(e.target.value)}
                                value={email} 
                                required/>
                        </div>
                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                        <button className='w-full font-semibold rounded-lg  py-2 transition duration-200 text-white hover:bg-[#e64323] cursor-pointer' onClick={() => handleSendOtp()}  style={{ backgroundColor: primaryColor, color: 'white' }}
                            disabled={Loading}>{Loading} ?< ClipLoader size={20} color='white'/>: "Send OTP"</button>
                        <p className='text-red-500 text-center my-[10px]' >*{error}</p>
                    </div>
                )}
                {step === 2 && (
                    <div>
                        <div className='mb-6'>
                            <label htmlFor="email" className='block text-gray-700 font-medium mb-1'>OTP</label>
                            <input
                                type="text" id="opt"
                                name="otp"
                                placeholder="Enter OTP"
                                className="w-full px-3 py-2 border-[1px] border-gray-200 rounded-lg focus:outline-none "
                                onChange={(e) => setOtp(e.target.value)}
                                value={otp}
                                required />
                        </div>
                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                        <button className='w-full font-semibold rounded-lg  py-2 transition duration-200 text-white hover:bg-[#e64323] cursor-pointer' onClick={handleVerifyOtp} style={{ backgroundColor: primaryColor, color: 'white' }}>
                            {Loading ? <ClipLoader size={20} color='white'/> : "Verify"}</button>
                            
                        <p className='text-red-500 text-center my-[10px]' >*{error}</p>
                    </div>
                )}
                {step === 3 && (
                    <div>
                        <div className='mb-6'>
                            <label htmlFor="newPassword" className='block text-gray-700 font-medium mb-1'>New Password</label>
                            <input
                                type="password" id="newPassword"
                                name="otp"
                                placeholder="Enter New Password"
                                className="w-full px-3 py-2 border-[1px] border-gray-200 rounded-lg focus:outline-none "
                                onChange={(e) => setNewPassword(e.target.value)}
                                value={newPassword} />
                        </div>
                        <div className='mb-6'>
                            <label htmlFor="confirmPassword" className='block text-gray-700 font-medium mb-1'>New Password</label>
                            <input
                                type="password" id="confirmPassword"
                                name="otp"
                                placeholder="Confirm Password"
                                className="w-full px-3 py-2 border-[1px] border-gray-200 rounded-lg focus:outline-none "
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                value={confirmPassword} 
                                required/>
                        </div>
                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                        <button className='w-full font-semibold rounded-lg  py-2 transition duration-200 text-white hover:bg-[#e64323] cursor-pointer' onClick={() => handleResetPassword()} style={{ backgroundColor: primaryColor, color: 'white' }}>
                            {Loading ? <ClipLoader size={20} color='white'/> : "Reset Password"}
                        </button>
                        <p className='text-red-500 text-center my-[10px]' >*{error}</p>
                    </div>
                )}
            </div>
        </div>
    )
}
