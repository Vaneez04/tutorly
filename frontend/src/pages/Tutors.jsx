import { useContext } from 'react'
import React from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate, useParams } from 'react-router-dom'
import { useState,useEffect } from 'react'
const Tutors = () => {
  const {tutors}=useContext(AppContext)
  const navigate=useNavigate()
  const {speciality}=useParams()  //speciality: Extracted from the URL, used to determine the current filter.
 
  // State variable initialized to an empty array, holds the list of tutors filtered by specialization.
const [filterTut, setfilterTut] = useState([])

const applyFilter=()=>{  //If speciality exists, filters the tutors array for those whose speciality matches the URL parameter.else saare display karo
  if (speciality) {
    setfilterTut(tutors.filter(t => t.speciality === speciality))
  } else {
    setfilterTut(tutors)
  }
}

//  jab bhi tutors ya speciality me change hoga to applyfilter run ho jayega
useEffect(() => {
  applyFilter()
}, [tutors, speciality])

return (
  <div>
    <p className="text-lg font-bold mb-4">Browse as per specialization</p>
    <div>
      <div className="flex flex-wrap gap-2 mb-6 cursor-pointer" >
        <p onClick={()=>speciality ==='Physics' ? navigate('/tutors') : navigate('/tutors/Physics')} className="px-4 py-2 bg-blue-100 rounded-md">Physics</p>
        <p onClick={()=>speciality ==='Chemistry' ? navigate('/tutors') : navigate('/tutors/Chemistry')} className="px-4 py-2 bg-blue-100 rounded-md">Chemistry</p>
        <p onClick={()=>speciality ==='Economics' ? navigate('/tutors') : navigate('/tutors/Economics')} className="px-4 py-2 bg-blue-100 rounded-md">Economics</p>
        <p onClick={()=>speciality ==='Web_Development' ? navigate('/tutors') : navigate('/tutors/Web_Development')} className="px-4 py-2 bg-blue-100 rounded-md">Web_Development</p>
        <p onClick={()=>speciality ==='Mathematics' ? navigate('/tutors') : navigate('/tutors/Mathematics')} className="px-4 py-2 bg-blue-100 rounded-md">Mathematics</p>
        <p onClick={()=>speciality ==='Cybersecurity' ? navigate('/tutors') : navigate('/tutors/Cybersecurity')} className="px-4 py-2 bg-blue-100 rounded-md">Cybersecurity</p>
      </div>
      <div className="grid grid-cols-4 gap-6 w-full">
  {filterTut.map((item, index) => (
    <div
      key={index}
      onClick={() => {
        navigate(`/appointment/${item._id}`);
        scrollTo(0, 0);
      }}
      className="border border-[#C9D8FF] rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
    >
      <img
        className="bg-[#EAEFFF] w-full h-40 object-cover"
        src={item.image}
        alt=""
      />
      <div className="p-4">
        <div
          className={`flex items-center gap-2 text-sm text-green-500`}
        >
          <p className="w-2 h-2 rounded-full bg-green-500"></p>
          <p>Available</p>
        </div>
        <p className="text-[#262626] text-lg font-medium">{item.name}</p>
        <p className="text-[#5C5C5C] text-sm">{item.speciality}</p>
      </div>
    </div>
  ))}
</div>

    </div>
  </div>
);

}

export default Tutors
