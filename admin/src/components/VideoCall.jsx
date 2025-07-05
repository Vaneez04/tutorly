import React, { useRef, useEffect, useState } from 'react'
import io from 'socket.io-client'

const socket = io(import.meta.env.VITE_BACKEND_URL)

const VideoCall = ({ roomId, onClose, isInitiator }) => {
  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const peerRef = useRef(null)
  const [stream, setStream] = useState(null)

  useEffect(() => {
    const setupCall = async () => {
      const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      localVideoRef.current.srcObject = localStream
      setStream(localStream)

      socket.emit('joinCallRoom', roomId)

      socket.on('offer', async ({ sdp }) => {
        if (!peerRef.current) createPeer(false, localStream)
        await peerRef.current.setRemoteDescription(new RTCSessionDescription(sdp))
        const answer = await peerRef.current.createAnswer()
        await peerRef.current.setLocalDescription(answer)
        socket.emit('answer', { roomId, sdp: answer })
      })

      socket.on('answer', async ({ sdp }) => {
        await peerRef.current.setRemoteDescription(new RTCSessionDescription(sdp))
      })

      socket.on('ice-candidate', ({ candidate }) => {
        if (candidate) {
          peerRef.current?.addIceCandidate(new RTCIceCandidate(candidate))
        }
      })

      if (isInitiator) createPeer(true, localStream)
    }

    setupCall()

    return () => {
      socket.off('offer')
      socket.off('answer')
      socket.off('ice-candidate')

      if (peerRef.current) {
        peerRef.current.close()
        peerRef.current = null
      }

      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }

      if (localVideoRef.current) localVideoRef.current.srcObject = null
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null
    }
  }, [roomId])

  const createPeer = (initiator, stream) => {
    const peer = new RTCPeerConnection()
    peerRef.current = peer

    stream.getTracks().forEach(track => peer.addTrack(track, stream))

    peer.ontrack = e => {
      remoteVideoRef.current.srcObject = e.streams[0]
    }

    peer.onicecandidate = e => {
      if (e.candidate) {
        socket.emit('ice-candidate', { roomId, candidate: e.candidate })
      }
    }

    if (initiator) {
      peer.createOffer().then(offer => {
        peer.setLocalDescription(offer)
        socket.emit('offer', { roomId, sdp: offer })
      })
    }
  }

  const endCall = () => {
    if (peerRef.current) {
      peerRef.current.close()
      peerRef.current = null
    }

    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }

    if (localVideoRef.current) localVideoRef.current.srcObject = null
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null

    onClose()
  }

  return (
    <div className="p-4 bg-white rounded shadow">
      <div className="flex gap-4">
        <video ref={localVideoRef} autoPlay muted className="w-1/2 h-60 bg-black rounded" />
        <video ref={remoteVideoRef} autoPlay className="w-1/2 h-60 bg-black rounded" />
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button onClick={endCall} className="bg-red-600 text-white px-4 py-2 rounded">End Call</button>
      </div>
    </div>
  )
}

export default VideoCall
