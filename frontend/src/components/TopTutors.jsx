import React, { useContext } from 'react'
// aisa likhne ki jagah hum context use kar rhe hai
// import { tutors } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext';

const TopTutors = () => {
  const navigate = useNavigate();
  const {tutors}=useContext(AppContext)
  return (
    <div className="flex flex-col items-center gap-4 my-16 text-[#262626] md:mx-10">
      <h1 className="text-3xl font-medium">Top Tutors to Book</h1>
      <p className="sm:w-1/3 text-center text-sm">
        Simply browse through our extensive list of trusted tutors.
      </p>
      <div className="flex flex-wrap justify-center gap-6 w-full">
        {tutors.slice(0, 10).map((item, index) => (
          <div onClick={() => {
              navigate(`/appointment/${item._id}`);
              scrollTo(0, 0);
            }}className="border border-[#C9D8FF] rounded-xl overflow-hidden cursor-pointer w-48"
            key={index}>
            <img src={item.image} alt="" className="w-full h-32 object-cover" />
            <div className="p-2">
              <div className={`flex items-center gap-2 text-sm ${
                  item.available ? "text-green-500" : "text-gray-500" }`}>
               <p className='w-2 h-2 rounded-full bg-green-500' ></p><p> Available</p>
              </div>
              <p className="text-center font-medium">{item.name}</p>
              <p className="text-center text-sm text-gray-600">{item.speciality}
              </p>
            </div>
          </div>
        ))}
      </div>
      <button onClick={()=>{navigate('/tutors'); scrollTo(0, 0)}} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
        More
      </button>
    </div>
  );
};


export default TopTutors
