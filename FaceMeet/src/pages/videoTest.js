import React, { useEffect, useRef, useState } from 'react';
import '../components/VideoTest.css';  // CSS 스타일 시트 임포트

function VideoTest() {
    const [participants] = useState([]);
    const [connectionStatus, setConnectionStatus] = useState(false); // 웹소켓 연결 상태
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const peerConnection = useRef(null);
    const ws = useRef(null);

    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:8001/ws/meeting/0521e6a34069489f85ea8c392df29ef/');
        
        ws.current.onmessage = function(e) {
            var data = JSON.parse(e.data);
            switch(data.type) {
                case 'offer':
                    handleOffer(data.sdp);
                    break;
                case 'answer':
                    handleAnswer(data.sdp);
                    break;
                case 'candidate':
                    handleCandidate(data.candidate);
                    break;
                default:
                    break;
            }
        };
        ws.current.onopen = () => {
            console.log("WebSocket Connected");
            setConnectionStatus(true);  // 연결이 성공하면 상태를 true로 변경
        };

        ws.current.onclose = () => {
            console.log("WebSocket Disconnected");
            setConnectionStatus(false);  // 연결이 끊기면 상태를 false로 변경
        };

        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                localVideoRef.current.srcObject = stream;
                peerConnection.current = new RTCPeerConnection({
                    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
                });
                stream.getTracks().forEach(track => {
                    peerConnection.current.addTrack(track, stream);
                });
                peerConnection.current.ontrack = event => {
                    remoteVideoRef.current.srcObject = event.streams[0];
                };
                peerConnection.current.onicecandidate = event => {
                    if (event.candidate) {
                        ws.current.send(JSON.stringify({ type: 'candidate', candidate: event.candidate }));
                    }
                };
            });

        return () => {
            if (ws.current) ws.current.close();
        };
    }, []);

    const handleOffer = (sdp) => {
        peerConnection.current.setRemoteDescription(new RTCSessionDescription({ type: 'offer', sdp }))
            .then(() => peerConnection.current.createAnswer())
            .then(answer => peerConnection.current.setLocalDescription(answer))
            .then(() => ws.current.send(JSON.stringify({ type: 'answer', sdp: peerConnection.current.localDescription.sdp })));
    };

    const handleAnswer = (sdp) => {
        peerConnection.current.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp }));
    };

    const handleCandidate = (candidate) => {
        peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
    };

    return (
        <div className="videoContainer">
            <div className={`videoContainer ${participants.length === 1 ? 'one' : participants.length === 2 ? 'two' : participants.length === 3 ? 'three' : 'four'}`}>
        <video ref={localVideoRef} autoPlay muted></video>
            <div className={`connectionStatus ${connectionStatus ? 'connected' : 'disconnected'}`}></div>
            <video ref={localVideoRef} autoPlay muted></video>
            <video ref={remoteVideoRef} autoPlay></video>
            </div>
        </div>
    );
}

export default VideoTest;
