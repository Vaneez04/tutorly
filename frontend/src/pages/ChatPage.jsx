import React, { useEffect, useState,useContext } from 'react'
import { useParams } from 'react-router-dom'
import ChatRoom from '../components/ChatRoom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'

const ChatPage = () => {
  const { appointmentId } = useParams()
  const [senderId, setSenderId] = useState("")
  const [senderRole, setSenderRole] = useState("")
const { backendUrl, token } = useContext(AppContext)
  useEffect(() => {
    const fetchUser = async () => {
      try {
      
        const { data } = await axios.get(backendUrl+'/api/user/get-profile', {
          headers: { token }
        })

        if (data.success) {
          setSenderId(data.userData._id)
          setSenderRole(data.userData.role)
        }
      } catch (error) {
        console.error("User auth failed", error)
      }
    }

if (token) fetchUser()
  }, [token])

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Chat Room</h2>
      {senderId && (
        <ChatRoom
          roomId={appointmentId}
          senderId={senderId}
          senderRole={senderRole}
        />
      )}
    </div>
  )
}

export default ChatPage
