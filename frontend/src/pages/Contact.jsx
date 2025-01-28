import React from 'react'
import { assets } from '../assets/assets';
const Contact = () => {
  return (
    <div className="px-6 md:px-16 lg:px-24 py-10">
      {/* Contact Us Header */}
      <div className="text-center text-2xl font-semibold text-[#707070] mb-10">
        <p>CONTACT US</p>
      </div>
  <div className="my-10 flex flex-col md:flex-row gap-10 items-center md:items-start text-sm text-gray-600">
     <img className="w-full md:max-w-[360px] rounded-lg" src={assets.contact_image} alt="Contact"/>
 <div>
            <p className="font-semibold text-lg text-gray-700">OUR OFFICE</p>
            <p className="text-gray-500 leading-relaxed">
              123 MG Road <br /> 4th Floor, Bengaluru, Karnataka, India
            </p>
            <p className="text-gray-500 mt-1">
              Tel: +91-9876543210 <br /> Email: tutorlytest@hotmail.com
            </p>
          </div>
          <div>
            <p className="font-semibold text-lg text-gray-700">CAREERS AT TUTORLY</p>
            <p className="text-gray-500 leading-relaxed">
              Learn more about our teams and job openings.
            </p>
            <button className="border border-gray-700 px-6 py-2 text-sm rounded-md hover:bg-gray-700 hover:text-white transition-all duration-300">
              Explore Jobs
            </button>
          </div>
        </div>
      </div>
   
  );
  
}

export default Contact
