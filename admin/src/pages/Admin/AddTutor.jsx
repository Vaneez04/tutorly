import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import { AppContext } from '../../context/AppContext'
const AddTutor = () => {
  const [docImg, setDocImg] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [experience, setExperience] = useState('1 Year')
  const [fees, setFees] = useState('')
  const [about, setAbout] = useState('')
  const [speciality, setSpeciality] = useState('Chemsitry')
  const [degree, setDegree] = useState('')
  const [address, setAddress] = useState('')

  const { backendUrl } = useContext(AppContext)
  

console.log('Backend URL:', backendUrl); // Add this to verify
    const { aToken } = useContext(AdminContext)
// submit handlerfn
    const onSubmitHandler = async (event) => {
      event.preventDefault()
      try {
        if (!docImg) {
          return toast.error('Image Not Selected')
      }
      const formData = new FormData();

      formData.append('image', docImg)
      formData.append('name', name)
      formData.append('email', email)
      formData.append('password', password)
      formData.append('experience', experience)
      formData.append('fees', Number(fees))
      formData.append('about', about)
      formData.append('speciality', speciality)
      formData.append('degree', degree)
      formData.append('address', address)

      
            // console log formdata            
            formData.forEach((value, key) => {
              console.log(`${key}: ${value}`);
          });
          const { data } = await axios.post(backendUrl + '/api/admin/add-tutor', formData, { headers: { aToken } })
          if (data.success) {
              toast.success(data.message)
            // jab success hojae to form ko clear krdo
                setDocImg(false)
                setName('')
                setPassword('')
                setEmail('')
                setAddress('')
             
                setDegree('')
                setAbout('')
                setFees('')
          } else {
              toast.error(data.message)
          }

      } catch (error) {
        toast.error(error.message)
            console.log(error)
      }
    }

  return (
    <form  onSubmit={onSubmitHandler} className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
    <p className="text-2xl font-semibold text-center mb-8">Add Tutor</p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-6 text-center">
        <label htmlFor="doc-img" className="cursor-pointer">
          <img src={docImg ? URL.createObjectURL(docImg) : assets.upload_area} alt="Upload Area" className="w-32 h-32 mx-auto" />
        </label>
        <input onChange={(e) => setDocImg(e.target.files[0])}  type="file" id="doc-img" hidden />
        <p className="text-sm mt-2 text-gray-600">Upload tutor picture</p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Your name</label>
            <input  onChange={e => setName(e.target.value)} value={name} type="text" placeholder="Name" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tutor Email</label>
            <input  onChange={e => setEmail(e.target.value)} value={email} type="email" placeholder="Email" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Set Password</label>
            <input  onChange={e => setPassword(e.target.value)} value={password} type="password" placeholder="Password" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      </div>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Experience</label>
          <select onChange={e => setExperience(e.target.value)} value={experience} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
            <option value="1 Year">1 Year</option>
            <option value="2 Year">2 Years</option>
            <option value="3 Year">3 Years</option>
            <option value="4 Year">4 Years</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Fees</label>
          <input onChange={e => setFees(e.target.value)} value={fees} type="number" placeholder="Tutor fees" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Speciality</label>
          <select onChange={e => setSpeciality(e.target.value)} value={speciality} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
            <option value="Physics">Physics</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Cybersecurity">Cybersecurity</option>
            <option value="Web_Development">Web Development</option>
            <option value="Economics">Economics</option>
            <option value="Mathematics">Mathematics</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Degree</label>
          <input onChange={e => setDegree(e.target.value)} value={degree} type="text" placeholder="Degree" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <input onChange={e => setAddress(e.target.value)} value={address} type="text" placeholder="Address" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>
    </div>
    <div className="mt-6">
      <label className="block text-sm font-medium text-gray-700">About tutor</label>
      <textarea   onChange={e => setAbout(e.target.value)}value={about} rows={5} placeholder="Write about tutor" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
    </div>
    <div className="flex justify-center mt-8">
      <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md transition-colors duration-300">Add tutor</button>
    </div>
  </form>
  
  )  
}

export default AddTutor
