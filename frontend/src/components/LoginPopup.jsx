import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios';
import { BlogContext } from '../context/BlogContext';
import { toast } from 'react-toastify';
import cross from "../assets/cross_icon.png"
const loginPopup = ({ setShowLogin }) => {
    const [currentState, setCurrentState] = useState("Sign Up");
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [data, setData] = useState({ username: "", email: "", password: "" });
    const { setToken, url } = useContext(BlogContext)

    const onChangeHandler = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setData({ ...data, [name]: value })
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            const endpoint = currentState === "Login" ? '/user/login' : '/user/register';
            const res = await axios.post(`${url + endpoint}`, data);
            if (res.status === 201 || res.status === 200) {
                toast.success(res.data.message);
                setShowLogin(false);
                localStorage.setItem("token", res.data.token);
                setToken(res.data.token);
                setData({ username: "", email: "", password: "" })
            }
            else {
                toast.error(res.data.error || "Something went wrong");
            }
        } catch (error) {
            toast.error(error.response?.data?.error || 'An unexpected error occurred.');
        }
    }

    const forgotPasswordHandler = async (e) => {
        e.preventDefault();
        try {
            console.log(data)
            const res = await axios.post(`${url}/user/forgot-password`, data);
            if (res.status === 200) {
                toast.success(res.data.message);
                setIsForgotPassword(false);
                setData({ username: "", email: "", password: "" })
            }
            else{
                toast.error(res.data.error || "Something went wrong");
            }
        } catch (error) {
            toast.error(error.response?.data?.error || 'An unexpected error occurred.');
        }
    }
    return (
        <div>
            <div className='fixed top-0 left-0 flex items-center justify-center w-full h-full bg-opacity-50 bg-slate-900 z-100'>
                <form onSubmit={onSubmitHandler} className='bg-white p-[20px] rounded-lg w-[300px] relative max-lg:w-[250px]'>
                    <div className="">
                        <h2 className='pl-2'>{currentState}</h2>
                        <img onClick={() => setShowLogin(false)} src={cross} className="cursor-pointer absolute right-[18px] top-[20px] hover:scale-110" alt="cross" />
                    </div>
                    <div className="flex flex-col gap-3 py-3">
                        {currentState === "Login" ?
                            <></> :
                            <input className='p-2 bg-gray-100 rounded-md' name='username' onChange={onChangeHandler} value={data.username} type="text" placeholder='Username' required />}
                        <input className='p-2 bg-gray-100 rounded-md' onChange={onChangeHandler} name='email' value={data.email} type="email" placeholder='Enter Your Email' required />
                        <input className='p-2 bg-gray-100 rounded-md' onChange={onChangeHandler} name='password' value={data.password} type="password" placeholder='Password' required />
                    </div>
                    <div className='flex items-center gap-2 pb-2'>
                        <input type="checkbox" required />
                        <p className='text-sm font-semibold'>I accept all terms and conditions</p>
                    </div>
                    <div className="pb-2"><button className='text-blue-400 underline cursor-pointer' onClick={() => setIsForgotPassword(true)}>Forgot Password</button></div>
                    <button className='p-2 text-white rounded-md bg-slate-500 hover:scale-110' type='submit'>{currentState === "Sign Up" ? "Create Account" : "Login"}</button>
                    {currentState === "Login"
                        ? <p className='pt-2'>Create a new account? <span className='font-semibold text-gray-900 cursor-pointer' onClick={() => setCurrentState("Sign Up")}>Click Here</span></p>
                        : <p className='pt-2'>Already have an account? <span className='font-semibold text-gray-900 cursor-pointer' onClick={() => setCurrentState("Login")}>Login</span></p>}
                </form>
            </div>

            {isForgotPassword && (
                <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-opacity-50 z-110 bg-slate-900">
                    <form onSubmit={forgotPasswordHandler} className="bg-white p-[20px] rounded-lg w-[300px] relative max-lg:w-[250px]">
                        <div className="">
                            <h2 className='pl-2'>Forgot Password</h2>
                            <img className='cursor-pointer absolute right-[15px] top-[20px] hover:scale-110' onClick={() => setIsForgotPassword(false)} src={cross} alt="cross" />
                        </div>
                        <div className="flex flex-col gap-3 py-3">
                            <input className='p-2 bg-gray-100 rounded-md' onChange={onChangeHandler} name='email' value={data.email} type="email" placeholder='Enter your email' required />
                            <input className='p-2 bg-gray-100 rounded-md' onChange={onChangeHandler} name='password' value={data.password} type="password" placeholder='Password' required />
                        </div>
                        <button className='p-2 text-white rounded-md bg-slate-500 hover:scale-110' type='submit'>Reset Password</button>
                    </form>
                </div>
            )}
        </div>
    )
}

export default loginPopup