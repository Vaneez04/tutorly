import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import ChatRoom from '../../components/ChatRoom'
import { TutorContext } from '../../context/TutorContext'
import axios from 'axios'

const ChatPage = () => {
  const { appointmentId } = useParams()
  const { tToken, backendUrl } = useContext(TutorContext)

  const [senderId, setSenderId] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTutor = async () => {
      try {
        const { data } = await axios.get(backendUrl+'/api/tutor/profile', {
          headers: { ttoken: tToken}
        })

        if (data.success) {
          setSenderId(data.profileData._id)

        }
      } catch (err) {
        console.error("Failed to fetch tutor profile", err)
      } finally {
        setLoading(false)
      }
    }

    if (tToken) fetchTutor()
  }, [tToken])

  if (loading) return <p className="text-center mt-10">Loading Chat...</p>

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Chat Room</h2>
      {senderId && (
        <ChatRoom roomId={appointmentId} senderId={senderId} />
      )}
    </div>
  )
}

export default ChatPage
