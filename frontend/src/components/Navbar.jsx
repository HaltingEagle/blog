import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import profile from "../assets/profile_icon.png";
import logo from "../assets/react.svg";
import { BlogContext } from '../context/BlogContext';

const Navbar = ({ setShowLogin }) => {
    const { token, setToken } = useContext(BlogContext);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const logout = () => {
        setToken("");
        localStorage.removeItem("token");
    };

    return (
        <div className='flex items-center justify-between p-[20px] bg-slate-200 mx-auto'>
            <Link to={"/"}><img src={logo} className='lg:mx-[40px] ml-4' alt="" /></Link>
                {token ?
                <div className='items-center hidden gap-4 lg:flex'>
                <Link to={"/addblog"} className='items-start no-underline cursor-pointer text-start hover:text-blue-800 lg:mx-auto'>Add Blog</Link>
                <Link to={"/profile"} className='hover:text-blue-800'>Profile</Link>
                </div> : <></>}
            {token ? (
                <div className='relative lg:mx-[40px]'>
                    <img src={profile} className='cursor-pointer max-lg:block lg:hidden' alt="profile icon" onClick={() => setIsDropdownOpen(!isDropdownOpen)}/>
                    {isDropdownOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-[1%]">
                            <ul className='w-[200px] text-center text-white bg-slate-900 rounded-lg shadow-lg'>
                                <li className='p-2 cursor-pointer'>
                                    <Link to={'/'} className='no-underline' onClick={() => setIsDropdownOpen(false)}>Home</Link>
                                </li>
                                <li className='p-2 cursor-pointer'>
                                    <Link to={'/addblog'} className='no-underline' onClick={() => setIsDropdownOpen(false)}>Add Blog</Link>
                                </li>
                                <li className='p-2 cursor-pointer'>
                                    <Link to={'/profile'} className='no-underline' onClick={() => setIsDropdownOpen(false)}>Profile</Link>
                                </li>
                                <li className='p-2 cursor-pointer' onClick={() => { logout(); setIsDropdownOpen(false); }}>Logout</li>
                            </ul>
                        </div>
                    )}
                    <p onClick={() => logout()} className='hidden text-red-400 cursor-pointer lg:block'>Logout</p>
                </div>
            ) : (
                <button onClick={() => setShowLogin(true)} className='relative items-center p-3 mr-4 rounded-full bg-slate-500 hover:bg-slate-400'>Sign In</button>
            )}
        </div>
    );
};

export default Navbar;
