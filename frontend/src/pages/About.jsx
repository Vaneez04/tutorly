import React from 'react'
import { assets } from '../assets/assets'
const About = () => {
  return (
    <div className="px-6 md:px-16 lg:px-24 py-10">
      {/* About Us */}
      <div className="text-center text-2xl font-semibold text-[#707070] mb-10">
        <p>ABOUT US</p>
      </div>
  
      <div className="my-10 flex flex-col md:flex-row gap-12">
        <img className="w-full md:max-w-[360px] rounded-lg shadow-md" src={assets.about_image} alt="" />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600 leading-relaxed">
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vero
            reprehenderit, ut vitae laudantium quos eligendi possimus non qui
            molestias nostrum necessitatibus accusantium molestiae, iure dolores
            sit aliquam tempora fuga, dignissimos facere. Ullam, sint error.
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem, modi,
            doloremque ipsam quaerat alias culpa, dolorem fugiat non ex in
            deserunt aperiam! Ut!
          </p>
          <b className="text-gray-800 text-lg">Our Vision</b>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro ipsum
            blanditiis ducimus reprehenderit suscipit optio, exercitationem illo
            odit! Esse suscipit repellendus enim a sed rem quae, voluptates
            similique cumque, sint dignissimos. Minus aspernatur veniam dolorum
            dicta quidem sapiente facilis eum rerum odio fugiat.
          </p>
        </div>
      </div>
  
      {/* Why Choose Us */}
      <div className="text-center text-xl font-medium text-gray-700 mb-8">
        <p>WHY CHOOSE US</p>
      </div>
  
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out hover:bg-gray-50">
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Hic,
            delectus repellendus aut autem doloremque saepe iste porro sequi ipsa
            sapiente minus voluptatem perspiciatis ratione at quidem eius
            accusantium necessitatibus aspernatur.
          </p>
        </div>
        <div className="flex-1 p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out hover:bg-gray-50">
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Hic,
            delectus repellendus aut autem doloremque saepe iste porro sequi ipsa
            sapiente minus voluptatem perspiciatis ratione at quidem eius
            accusantium necessitatibus aspernatur.
          </p>
        </div>
      </div>
    </div>
  );
  
}

export default About
