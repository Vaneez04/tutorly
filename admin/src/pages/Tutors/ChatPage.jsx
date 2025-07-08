// pages/ChatPage.jsx
import React from 'react'
import { useParams, useLocation } from 'react-router-dom'
import ChatRoom from '../../components/ChatRoom'

const ChatPage = () => {
  const { appointmentId } = useParams()
  const location = useLocation()

  const queryParams = new URLSearchParams(location.search)
  const senderId = queryParams.get("senderId")
  const senderRole = queryParams.get("senderRole") || "User"

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Chat Room</h2>
      <ChatRoom roomId={appointmentId} senderId={senderId} senderRole={senderRole} />
    </div>
  )
}

export default ChatPage
