import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'

const TutorsList = () => {
  const {tutors,aToken, getAllTutors}=useContext(AdminContext)
  useEffect(() => {
    if (aToken) {
      getAllTutors()
  }
  }, [aToken])
  
  return (
    <div className="p-4">
  <h1 className="text-2xl font-bold text-gray-700 mb-6">All Tutors</h1>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {tutors.map((item, index) => (
      <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <img className="w-full h-48 object-cover" src={item.image} alt={item.name} />
        <div className="p-4">
          <p className="text-lg font-semibold text-gray-800">{item.name}</p>
          <p className="text-sm text-gray-600 mb-3">{item.speciality}</p>
          <div className="flex items-center gap-2">
            <input  type="checkbox" checked={item.available} className="w-4 h-4 accent-green-500" readOnly />
            <p className="text-sm text-gray-600">Available</p>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>

  
  )
}

export default TutorsList
