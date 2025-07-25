
import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'   //iska kam jab tha jab backend se api nhi la rhe the

const Myprofile = () => {
    const { token, backendUrl, userData, setUserData, loadUserProfileData } = useContext(AppContext)

    const [isEdit, setIsEdit] = useState(false)

    const [image, setImage] = useState(false)

    // Function to update user profile data using API
    const updateUserProfileData = async () => {

        try {

            const formData = new FormData();

            formData.append('name', userData.name)
            formData.append('phone', userData.phone)
            formData.append('address', userData.address)
            formData.append('gender', userData.gender)
            formData.append('dob', userData.dob)

            image && formData.append('image', image)

            const { data } = await axios.post(backendUrl + '/api/user/update-profile', formData, { headers: { token } })

            if (data.success) {
                toast.success(data.message)
                await loadUserProfileData()
                setIsEdit(false)
                setImage(false)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }
    return userData && (
      <div className="max-w-lg w-full px-4 sm:px-6 md:ml-0 md:mr-auto text-left flex flex-col gap-4 text-sm pt-5">

  {isEdit ? (
    <label htmlFor="image">
      <div className="inline-block relative cursor-pointer">
        <img
          className="w-36 rounded opacity-75"
          src={image ? URL.createObjectURL(image) : userData.image}
          alt=""
        />
        <img
          className="w-10 absolute bottom-12 right-12"
          src={image ? "" : assets.upload_icon}
          alt=""
        />
      </div>
      <input
        onChange={(e) => setImage(e.target.files[0])}
        type="file"
        id="image"
        hidden
      />
    </label>
  ) : (
    <img className="w-36 rounded" src={userData.image} alt="" />
  )}

  {isEdit ? (
    <input
      className="bg-gray-50 text-2xl sm:text-3xl font-medium w-full max-w-xs"
      type="text"
      onChange={(e) =>
        setUserData((prev) => ({ ...prev, name: e.target.value }))
      }
      value={userData.name}
    />
  ) : (
    <p className="font-medium text-2xl sm:text-3xl text-[#262626] mt-4 break-words">
      {userData.name}
    </p>
  )}

  <hr className="bg-[#ADADAD] h-[1px] border-none" />

  <div>
    <p className="text-gray-600 underline mt-3">CONTACT INFORMATION</p>
    <div className="grid grid-cols-1 sm:grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-[#363636]">
      <p className="font-medium">Email id:</p>
      <p className="text-blue-500 break-words">{userData.email}</p>

      <p className="font-medium">Phone:</p>
      {isEdit ? (
        <input
          className="bg-gray-50 w-full max-w-xs"
          type="text"
          onChange={(e) =>
            setUserData((prev) => ({ ...prev, phone: e.target.value }))
          }
          value={userData.phone}
        />
      ) : (
        <p className="text-blue-500">{userData.phone}</p>
      )}

      <p className="font-medium">Address:</p>
      {isEdit ? (
        <input
          className="bg-gray-50 w-full"
          type="text"
          onChange={(e) =>
            setUserData((prev) => ({ ...prev, address: e.target.value }))
          }
          value={userData.address}
        />
      ) : (
        <p className="text-gray-500 break-words">{userData.address}</p>
      )}
    </div>
  </div>

  <div>
    <p className="text-[#797979] underline mt-3">BASIC INFORMATION</p>
    <div className="grid grid-cols-1 sm:grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-gray-600">
      <p className="font-medium">Gender:</p>
      {isEdit ? (
        <select
          className="bg-gray-50 max-w-[120px]"
          onChange={(e) =>
            setUserData((prev) => ({ ...prev, gender: e.target.value }))
          }
          value={userData.gender}
        >
          <option value="Not Selected">Not Selected</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      ) : (
        <p className="text-gray-500">{userData.gender}</p>
      )}

      <p className="font-medium">Birthday:</p>
      {isEdit ? (
        <input
          className="bg-gray-50 max-w-[140px]"
          type="date"
          onChange={(e) =>
            setUserData((prev) => ({ ...prev, dob: e.target.value }))
          }
          value={userData.dob}
        />
      ) : (
        <p className="text-gray-500">{userData.dob}</p>
      )}
    </div>
  </div>

  <div className="mt-10">
    {isEdit ? (
      <button
        onClick={updateUserProfileData}
        className="border border-blue-400 px-6 py-2 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-all w-full sm:w-auto"
      >
        Save information
      </button>
    ) : (
      <button
        onClick={() => setIsEdit(true)}
        className="border border-blue-400 px-6 py-2 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-all w-full sm:w-auto"
      >
        Edit
      </button>
    )}
  </div>
</div>

    )
}

export default Myprofile
