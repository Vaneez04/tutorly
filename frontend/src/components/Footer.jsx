import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='md:mx-10'>
      
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10  mt-40 text-sm'>
        {/* left */}
      <div>
        <img className='mb-5 w-40' src={assets.logo}/>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam amet natus commodi velit repudiandae laboriosam voluptate vitae labore possimus exercitationem eveniet, quis dolores rerum iure culpa optio neque rem, non repellendus vero expedita ipsa? Laudantium, accusamus dolorum. Sint, non beatae officiis, quasi exercitationem incidunt corrupti illum consectetur modi rerum obcaecati.
        </p>
      </div>
      {/* center */}
      <div>
        <p className='text-xl font-medium mb-5'>COMPANY</p>
        <ul className='flex flex-col gap-2 text-gray-600'>
            <li>Home</li>
            <li>About Us</li>
            <li>Tutors</li>
            <li>Privacy Policy</li>
        </ul>
      </div>
      {/* right */}
      <div>
        <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>

        <ul className='flex flex-col gap-2 text-gray-600'>
     <li>+919898777667</li>
     <li>tutorlytest@hotmail.com</li>
     </ul>
      </div>
    </div>

    <div>
        <hr />
        <p className='py-5 text-sm text-center'>Copyright 2025 @ Tutorly.com - All Right Reserved.</p>
      </div>
      </div>
  )
}

export default Footer
