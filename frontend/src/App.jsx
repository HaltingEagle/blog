import React, { useState } from 'react'
import Navbar from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
import LoginPopup from './components/LoginPopup'
import Home from './pages/Home'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import AddBlog from './pages/AddBlog'
import Blog from './pages/Blog'
import Profile from './pages/Profile'
const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  return (
    <>
    <ToastContainer/>
    {showLogin ? <LoginPopup setShowLogin={setShowLogin}/> : <></>}
    <div className=''>
      <Navbar setShowLogin={setShowLogin}/>
      <Routes>
        <Route exact path='/' element={<Home/>}/>
        <Route path='/addblog' element={<AddBlog/>}/>
        <Route path='/blog/:id' element={<Blog/>}/>
        <Route path='/profile' element={<Profile/>}/>
      </Routes>
    </div>
    </>
  )
}

export default App