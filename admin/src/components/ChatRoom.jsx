import React, { useEffect, useState, useRef } from 'react'
import io from 'socket.io-client'
import axios from 'axios'

const backendUrl = import.meta.env.VITE_BACKEND_URL
const socket = io(backendUrl)

const ChatRoom = ({ roomId, senderId, senderRole = "User", collapsible = false }) => {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [showChat, setShowChat] = useState(!collapsible)
  const chatEndRef = useRef(null)

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axios.post(`${backendUrl}/api/chat/messages`, { appointmentId: roomId })
        if (data.success) setMessages(data.messages)
      } catch (err) {
        console.error("Error fetching messages:", err)
      }
    }

    fetchMessages()
    socket.emit("joinRoom", roomId)

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg])
    })

    return () => socket.off("receiveMessage")
  }, [roomId])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = () => {
    if (!newMessage.trim()) return
    socket.emit("sendMessage", {
      roomId,
      message: newMessage,
      senderId
    })
    setNewMessage("")
  }

  return (
    <div className="text-sm">
      {collapsible && (
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded mb-2"
          onClick={() => setShowChat(!showChat)}
        >
          {showChat ? "Hide Chat" : "ANSWER IN CHAT"}
        </button>
      )}

      {showChat && (
        <div className="max-w-md border rounded shadow p-4 bg-white space-y-2">
          <div className="h-60 overflow-y-auto flex flex-col border-b pb-2">
            {messages.length === 0 && <p className="text-gray-400 text-center mt-6">No messages yet</p>}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`my-1 flex ${msg.senderId === senderId ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`px-3 py-1 rounded-lg text-white max-w-[75%] text-sm ${msg.senderId === senderId ? 'bg-blue-600' : 'bg-gray-600'}`}>
                  <span>{msg.message}</span>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type your message"
              className="flex-1 px-3 py-2 border rounded focus:outline-none"
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
