import React, { useRef, useEffect, useState } from 'react'
import io from 'socket.io-client'

const socket = io(import.meta.env.VITE_BACKEND_URL)

const VideoCall = ({ roomId, onClose }) => {
  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const peerRef = useRef(null)
  const [stream, setStream] = useState(null)

  useEffect(() => {
    const startCall = async () => {
      const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localVideoRef.current.srcObject = localStream;
      setStream(localStream);

      socket.emit("joinCallRoom", roomId);

      socket.on("offer", handleReceiveOffer);
      socket.on("answer", handleAnswer);
      socket.on("ice-candidate", handleNewICECandidateMsg);

      // Start as initiator only once stream is ready
      peerRef.current = createPeer(true);
    }

    startCall();

    return () => {
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
    }
  }, [roomId]);

  const handleReceiveOffer = async ({ sdp }) => {
    peerRef.current = createPeer(false);
    await peerRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
    const answer = await peerRef.current.createAnswer();
    await peerRef.current.setLocalDescription(answer);
    socket.emit("answer", { roomId, sdp: answer });
  }

  const handleAnswer = async ({ sdp }) => {
    await peerRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
  }

  const handleNewICECandidateMsg = ({ candidate }) => {
    peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
  }

  const createPeer = (isInitiator) => {
    const peer = new RTCPeerConnection();
    stream?.getTracks().forEach(track => peer.addTrack(track, stream));

    peer.ontrack = (e) => {
      remoteVideoRef.current.srcObject = e.streams[0];
    }

    peer.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit("ice-candidate", { roomId, candidate: e.candidate });
      }
    }

    if (isInitiator) {
      peer.createOffer().then(offer => {
        peer.setLocalDescription(offer);
        socket.emit("offer", { roomId, sdp: offer });
      });
    }

    return peer;
  }

  const endCall = () => {
    stream?.getTracks().forEach(track => track.stop());
    peerRef.current?.close();
    onClose(); // Hide the call window
  }

  return (
    <div className="p-4 border bg-white rounded">
      <div className="flex gap-4">
        <video ref={localVideoRef} autoPlay muted className="w-1/2" />
        <video ref={remoteVideoRef} autoPlay className="w-1/2" />
      </div>
      <button onClick={endCall} className="mt-2 bg-red-500 text-white px-4 py-2 rounded">End Call</button>
    </div>
  )
}

export default VideoCall
