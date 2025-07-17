import React, { useEffect, useState, useRef, useContext } from 'react'
import axios from 'axios'
import { AppContext } from '../context/AppContext'
import { io } from 'socket.io-client'

const ChatRoom = ({ roomId, senderId, collapsible = false }) => {
  const { backendUrl, token } = useContext(AppContext)

  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [showChat, setShowChat] = useState(!collapsible)
  const [imageFile, setImageFile] = useState(null)
  const chatEndRef = useRef(null)

  const socketRef = useRef(null) // hold socket instance

  useEffect(() => {
    //  Initialize socket with JWT token
    const socket = io(backendUrl, {
      auth: { token }
    })
    socketRef.current = socket

    //  Join the room
    socket.emit("joinRoom", roomId)

    //  Fetch old messages
    const fetchMessages = async () => {
      try {
        const { data } = await axios.post(`${backendUrl}/api/chat/messages`, {
          appointmentId: roomId
        }, {
          headers: { token }
        })
        if (data.success) setMessages(data.messages)
      } catch (err) {
        console.error("Error fetching messages:", err)
      }
    }

    fetchMessages()

    //  Listen for new incoming messages
    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg])
    })

    return () => {
      socket.disconnect()
    }
  }, [roomId, token, backendUrl])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      setImageFile(file)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() && !imageFile) return

    let imageUrl = ""

    if (imageFile) {
      const formData = new FormData()
      formData.append("file", imageFile)

      try {
        const { data } = await axios.post(`${backendUrl}/api/chat/upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            token
          }
        })
        if (data.success) imageUrl = data.url
      } catch (err) {
        console.error("Image upload failed", err)
        return
      }
    }

    //  Send message WITHOUT senderId
    socketRef.current.emit("sendMessage", {
      roomId,
      message: newMessage,
      image: imageUrl
    })

    setNewMessage("")
    setImageFile(null)
  }

  return (
    <div className="text-sm">
      {collapsible && (
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded mb-2"
          onClick={() => setShowChat(!showChat)}
        >
          {showChat ? "Hide Chat" : "ASK IN CHAT"}
        </button>
      )}

      {showChat && (
        <div className="max-w-md border rounded shadow p-4 bg-white space-y-2">
          <div className="h-60 overflow-y-auto flex flex-col border-b pb-2">
            {messages.length === 0 && (
              <p className="text-gray-400 text-center mt-6">No messages yet</p>
            )}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`my-1 flex ${msg.senderId === senderId ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`px-3 py-2 rounded-lg max-w-[75%] text-sm ${
                  msg.senderId === senderId
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-black'
                }`}>
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="sent"
                      className="mb-1 rounded max-w-full h-auto"
                    />
                  )}
                  {msg.message && <p>{msg.message}</p>}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {imageFile && (
            <div className="mt-2">
              <img
                src={URL.createObjectURL(imageFile)}
                alt="Preview"
                className="w-32 h-32 object-cover rounded"
              />
            </div>
          )}

          <div className="flex gap-2 mt-2 items-center">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type your message"
              className="flex-1 px-3 py-2 border rounded focus:outline-none"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="text-sm"
            />
            <button
              onClick={sendMessage}
              className="px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatRoom
