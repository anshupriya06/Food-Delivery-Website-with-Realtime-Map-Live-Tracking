import axios from 'axios';
import React from 'react'
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../App';
import { auth } from '../../firebase';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { ClipLoader } from 'react-spinners';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice.js';

function SignUp() {
    const primaryColor = "#ff4d2d";
    const bgColor = "#fff9f6";
    const borderColor = "#ddd";
    const [showPassword, setShowPassword] = React.useState(false);
    const [role, setRole] = React.useState("user");
    const navigate = useNavigate();
    const [fullName, setFullName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [mobile, setMobile] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);

    const dispatch = useDispatch();

    const handleSignUp = async () => {
        setLoading(true);
        setError(null); 
        try {
            const result = await axios.post(`${serverUrl}/api/v1/auth/signup`, {
                fullName, email, mobile, password, role
            },
                { withCredentials: true });
            dispatch(setUserData(result.data));
            setError("")
            setLoading(false);
            navigate('/signin');
        }
        catch (error) {
            setError(error?.response?.data?.message || error.message);
            setLoading(false);
        }
    }

        const handleGoogleAuth = async () => {
            if (!mobile) {
                return setError("Mobile number is required.")
            }
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            try {
                const {data} = await axios.post(`${serverUrl}/api/v1/auth/google-auth`, {
                    fullName: result.user.displayName,
                    email: result.user.email,
                    mobile,
                    role
                }, { withCredentials: true });
                dispatch(setUserData(data));
            } catch (error) {
                setError(error?.response?.data?.message || error.message);
            }
        
        }

        
        return (
            <div className='min-h-screen w-full flex items-center justify-center p-4' style=
                {{ backgroundColor: bgColor }}>
                <div className={`bg-white rounded-xl shadow-lg w-full max-w-md p-8 border `}
                    style={{ border: `1px solid ${borderColor}` }}>

                    <h1 className="text-3xl font-bold mb-2" style={{ color: primaryColor }}>Tathastu</h1>
                    <p className='text-gray-600 mb-8'>Create your account to get started with delicious food deiveries</p>

                    {/* fullName */}

                    <div className='mb-4'>
                        <label htmlFor="fullName" className='block text-gray-700 font-medium mb-1'>Full Name</label>
                        <input
                            type="text" id="fullName"
                            name="fullName"
                            placeholder="Enter your full name"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none "
                            style={{ border: `1px solid ${borderColor}` }}
                            onChange={(e) => setFullName(e.target.value)}
                            value={fullName}
                            required />
                    </div>

                    {/* email */}

                    <div className='mb-4'>
                        <label htmlFor="email" className='block text-gray-700 font-medium mb-1'>Email</label>
                        <input
                            type="email" id="email"
                            name="email"
                            placeholder="Enter your email"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none "
                            style={{ border: `1px solid ${borderColor}` }}
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            required />
                    </div>

                    {/* mobile */}

                    <div className='mb-4'>
                        <label htmlFor="mobile" className='block text-gray-700 font-medium mb-1'>Mobile No.</label>
                        <input
                            type="text" id="mobile"
                            name="mobile"
                            placeholder="Enter your mobile number"
                            pattern="[0-9]{10}" // Basic pattern for 10 digits
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                            style={{ border: `1px solid ${borderColor}` }}
                            onChange={(e) => setMobile(e.target.value)}
                            value={mobile}
                            required />
                    </div>

                    {/* password */}

                    <div className='mb-4'>
                        <label htmlFor="password" className='block text-gray-700 font-medium mb-1'>Password</label>
                        <div className='relative'>
                            <input
                                type={`${showPassword ? 'text' : 'password'}`}
                                id="password"
                                name="password"
                                placeholder="Enter your password"
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                                style={{ border: `1px solid ${borderColor}` }}
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                required />
                            <button className='absolute cursor-pointer right-3 top-[14px] text-gray-500' onClick={() => setShowPassword(!showPassword)}>{!showPassword ? <FaEye /> : <FaEyeSlash />}</button>
                        </div>
                    </div>

                    {/* role */}

                    <div className='mb-4'>
                        <label htmlFor="role" className='block text-gray-700 font-medium mb-1'>Role</label>
                        <div className='flex gap-2'>
                            {['user', 'owner', 'deliveryBoy'].map((r) => (
                                <button 
                                    key={r}
                                    className='flex-1 border rounded-lg px-3 py-2 text-center font-medium transition-colors cursor-pointer'
                                    onClick={() => setRole(r)}
                                    style={role === r ?
                                        { backgroundColor: primaryColor, color: 'white', border: `1px solid ${primaryColor}` } : { border: `1px solid ${borderColor}`, color: 'black', backgroundColor: 'white' }}
                                >{r}</button>
                            ))}
                        </div>
                    </div>
                    
                    <button className='w-full font-semibold rounded-lg  py-2 transition duration-200 text-white     hover:bg-[#e64323] cursor-pointer' onClick={handleSignUp} disabled={loading}
                        style={{ backgroundColor: primaryColor, color: 'white' }}>
                        {loading ? <ClipLoader size={20} color='white'/> : 'Sign Up'}</button>
                    
                    {error && <p className='text-red-500 text-center my-[10px]' >*{error}</p>}

                    <button onClick={handleGoogleAuth} className='w-full mt-4 cursor-pointer flex items-center justify-center gap-2  border rounded-lg px-4 py-2 transition duration-200 border-gray-400 hover:bg-gray-100'>
                        <FcGoogle size={20} />
                        <span>Sign Up with Google</span>
                    </button>
                    <p className='text-center mt-2 cursor-pointer' onClick={() => navigate('/signin')}>Already have an account? <span className='text-[#e64323]'>Sign In</span></p>
                </div>
            </div>
        )
    }
export default SignUp