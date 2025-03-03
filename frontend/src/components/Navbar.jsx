import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { AppContext } from '../context/AppContext'
const Navbar = () => {
  // useNavigate is a hook
  const navigate=useNavigate()
  // token jo user login pe ayega 
const {token,setToken,userData}=useContext(AppContext)
   
const logout=()=>{
  setToken(false)
  localStorage.removeItem('token')
}
    return (
    <div className='flex items-center justify-between text-sm py-3 mb-5 border-b border-b-[#e3e0e0]'>
      <img onClick={()=>navigate('/')} className='w-44 cursor-pointer' src={assets.logo}/>
      <ul className='md:flex items-start gap-5 font-medium hidden'>
        <NavLink to='/'>
            <li className='py-1'>Home</li>
              <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/tutors'>
            <li className='py-1'>All Tutors</li>
              <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/about'>
            <li className='py-1'>About</li>
              <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/contact'>
            <li className='py-1' >Contact</li>
              <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <a target='_blank' href="https://tutorly-admin.onrender.com/" className='border px-5 text-xs py-1.5 rounded-full'>Admin Panel</a>
      </ul>

      {/* yaha ham token ko state ki tarah use kar rhe agar login hai user to pic aur dropdown dikhao warna (agar token false ho) to create account show karo */}
      <div className='flex items-center gap-4 '>
        {token && userData ? <div className='flex items-center gap-2 cursor-pointer group relative'>
          <img className='w-8 rounded-full' src={userData.image} alt=""/>
          <img className='w-2.5' src={assets.dropdown_icon} alt="" />
          <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
          <div className='min-w-48 bg-gray-50 rounded flex flex-col gap-4 p-4'>
                <p onClick={() => navigate('/profile')} className='hover:text-black cursor-pointer'>My Profile</p>
                  <p onClick={() => navigate('/appointments')} className='hover:text-black cursor-pointer'>My Appointments</p>
                  <p onClick={logout} className='hover:text-black cursor-pointer'>Logout</p>
                  </div>
                  </div>
                </div>
                :<button onClick={()=>navigate('/login')} className='bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block'>Create Account</button>
}
      </div>
    </div>
  )
}

export default Navbar
