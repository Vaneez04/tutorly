import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div className="px-4 sm:px-6 md:px-16 lg:px-24 py-10">
      {/* About Us */}
      <div className="text-center text-2xl sm:text-3xl font-semibold text-[#707070] mb-8 sm:mb-10">
        <p>ABOUT US</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 sm:gap-10 lg:gap-12 items-center my-8">
        <img
          className="w-full sm:max-w-[400px] rounded-lg shadow-md"
          src={assets.about_image}
          alt="About Tutorly"
        />
        <div className="flex flex-col justify-center gap-4 sm:gap-6 text-sm sm:text-base text-gray-700 leading-relaxed">
          <p>
            Our platform offers a seamless tutor appointment booking system designed specifically for students to resolve academic doubts efficiently. Students can explore tutor profiles based on specialization and schedule appointments in available time slots.
          </p>
          <p>
            We've implemented secure features like secure authentication and Razorpay-powered online payments. Users can update their profiles, upload images , and manage their appointments effectively — including cancellation and tracking.
          </p>
          <b className="text-gray-800 text-base sm:text-lg mt-2">Our Vision</b>
          <p>
            To bridge the gap between learners and subject experts by offering an interactive, efficient, and secure platform. From personalized appointments to real-time communication via chat and video calls, we aim to enhance academic support accessibility.
          </p>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="text-center text-xl sm:text-2xl font-medium text-gray-700 mb-6 sm:mb-8">
        <p>WHY CHOOSE US</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 p-5 sm:p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out hover:bg-gray-50">
          <p>
             One-tap appointment booking with your preferred tutor. We ensure no double-booking in the same time slot. Tutors and students both have access to dynamic dashboards for tracking progress and sessions.
          </p>
        </div>
        <div className="flex-1 p-5 sm:p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out hover:bg-gray-50">
          <p>
            Secure login/signup , file upload support  live chat and video calling features to connect tutors and students in real-time. 
          </p>
        </div>
      </div>
    </div>
  )
}

export default About
