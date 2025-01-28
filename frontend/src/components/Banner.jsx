import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Banner = () => {
    const navigate=useNavigate()
  return (
    <div className='flex bg-primary rounded-lg  px-6 sm:px-10 md:px-14 lg:px-12 my-20 md:mx-10'>
        {/* left */}
    <div className='flex-1 py-8 sm:py-10 md:py-16 lg:py-24 lg:pl-5'>
        <p className='text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold text-white'>Book a Session
<br/>With 100+ Trusted Tutors</p>
<button onClick={()=>{navigate('/login'); scrollTo(0,0) }} className='bg-white text-sm sm:text-base text-[#595959] px-8 py-3 rounded-full mt-6 hover:scale-105 transition-all '>Create Account</button>
    </div>
    {/* right side */}
    <div className="hidden md:block md:w-1/2 lg:w-[370px] relative overflow-hidden">
  <img
    className="absolute bottom-0 right-0 w-full h-auto max-h-full object-contain"
    src={assets.about_image}
    alt="About"
  />
</div>
    </div>
  )
}

export default Banner
