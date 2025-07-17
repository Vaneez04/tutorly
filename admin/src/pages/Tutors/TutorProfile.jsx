import React, { useContext, useEffect, useState } from 'react'
import { TutorContext } from '../../context/TutorContext'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const TutorProfile = () => {
   const { tToken, profileData, setProfileData, getProfileData } = useContext(TutorContext)
   const { currencySymbol, backendUrl } = useContext(AppContext)

     useEffect(() => {
           if (tToken) {
               getProfileData()
           }
       }, [tToken])
  return profileData && (
    <div>
            <div className='flex flex-col gap-4 m-5'>
                <div>
                    <img className='bg-primary/80 w-full sm:max-w-64 rounded-lg' src={profileData.image} alt="" />
                </div>

                <div className='flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white'>

                    {/* ----- Tut Info : name, degree, experience ----- */}

                    <p className='flex items-center gap-2 text-3xl font-medium text-gray-700'>{profileData.name}</p>
                    <div className='flex items-center gap-2 mt-1 text-gray-600'>
                        <p>{profileData.degree} - {profileData.speciality}</p>
                        <button className='py-0.5 px-2 border text-xs rounded-full'>{profileData.experience}</button>
                    </div>
                    </div>
                    </div>
                    </div>
  )              
}

export default TutorProfile
