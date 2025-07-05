import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [state, setState] = useState('Sign Up')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const { backendUrl, token, setToken } = useContext(AppContext)  // getting from appcontext

  const onSubmitHandler = async (event) => {
     event.preventDefault()
     
     if (state === 'Sign Up') {

      const { data } = await axios.post(backendUrl + '/api/user/register', { name, email, password })

      if (data.success) {
        localStorage.setItem('token', data.token)   //userlogin token ko local storage me save aur state bhi nana denge taki reload karne par bhi hum login hi rhe
        setToken(data.token)
      } else {
        toast.error(data.message)
      }

    } else {

      const { data } = await axios.post(backendUrl + '/api/user/login', { email, password })

      if (data.success) {
        localStorage.setItem('token', data.token)
        setToken(data.token)
      } else {
        toast.error(data.message)
      }

    }
  }
    useEffect(() => {
      if (token) {
        navigate('/')          // agar token present hai(login ho gya h) to home page par bhejo
      }
    }, [token]) 
  
  
  return (
    <div className="flex justify-center items-center min-h-screen px-4 py-8 sm:px-6">
  <form onSubmit={onSubmitHandler} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
    <div>
      <p className="text-2xl font-bold text-center mb-2">{state === 'Sign Up' ? 'Create Account' : 'Login'}</p>
      <p className="text-sm text-gray-600 text-center mb-6">
        Please {state === 'Sign Up' ? 'Create Account' : 'Login'} to book
      </p>

      {state === 'Sign Up' && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-1">Full Name</p>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      )}

      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-1">Email</p>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-1">Password</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
    </div>

    <button
      type="submit"
      className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
    >
      {state === 'Sign Up' ? 'Create account' : 'Login'}
    </button>

    {state === 'Sign Up' ? (
      <p className="text-sm text-gray-600 text-center mt-4">
        Already have an account?{' '}
        <span
          onClick={() => setState('Login')}
          className="text-blue-500 cursor-pointer hover:underline"
        >
          Login here
        </span>
      </p>
    ) : (
      <p className="text-sm text-gray-600 text-center mt-4">
        Create a new account?{' '}
        <span
          onClick={() => setState('Sign Up')}
          className="text-blue-500 cursor-pointer hover:underline"
        >
          Click here
        </span>
      </p>
    )}
  </form>
</div>

  )
}

export default Login
