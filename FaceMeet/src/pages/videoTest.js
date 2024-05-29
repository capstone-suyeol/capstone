import React, { useEffect, useState, useRef } from 'react';
import { useParams } from "react-router-dom";

const MeetingDetail = () => {
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const { meeting_id } = useParams();
    const localVideoRef = useRef();
    const remoteVideoRef = useRef();
    const pc = useRef(null);
    const ws = useRef(null);
    const pendingCandidates = useRef([]);

    useEffect(() => {
        // RTCPeerConnection 초기화
        pc.current = new RTCPeerConnection({
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' }
            ]
        });

        ws.current = new WebSocket(`wss://172.20.10.7/ws/meeting/${meeting_id}/`);

        ws.current.onmessage = async (event) => {
            const data = JSON.parse(event.data);
            console.log('WebSocket 메시지 수신:', data);

            if (data.type === 'offer') {
                if (pc.current.signalingState !== 'stable') {
                    console.error('Unexpected signaling state:', pc.current.signalingState);
                    return;
                }
                const desc = new RTCSessionDescription(data.sdp);
                await pc.current.setRemoteDescription(desc);
                const answer = await pc.current.createAnswer();
                await pc.current.setLocalDescription(answer);
                ws.current.send(JSON.stringify({ type: 'answer', sdp: answer }));
            } else if (data.type === 'answer') {
                if (pc.current.signalingState !== 'have-local-offer') {
                    console.error('Unexpected signaling state:', pc.current.signalingState);
                    return;
                }
                const desc = new RTCSessionDescription(data.sdp);
                await pc.current.setRemoteDescription(desc);
                pendingCandidates.current.forEach(async candidate => {
                    await pc.current.addIceCandidate(new RTCIceCandidate(candidate));
                });
                pendingCandidates.current = [];
            } else if (data.type === 'candidate') {
                const candidate = new RTCIceCandidate(data.candidate);
                if (pc.current.remoteDescription) {
                    await pc.current.addIceCandidate(candidate);
                } else {
                    pendingCandidates.current.push(data.candidate);
                }
            }
        };

        pc.current.onicecandidate = (event) => {
            if (event.candidate) {
                ws.current.send(JSON.stringify({
                    type: 'candidate',
                    candidate: event.candidate
                }));
            }
        };

        pc.current.ontrack = (event) => {
            console.log('트랙 수신:', event.streams);
            setRemoteStream(event.streams[0]);
        };

        const startLocalStream = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setLocalStream(stream);
                stream.getTracks().forEach(track => {
                    if (pc.current.signalingState !== 'closed') {
                        pc.current.addTrack(track, stream);
                    }
                });
            } catch (error) {
                console.error('미디어 장치 접근 중 에러 발생:', error);
            }
        };

        startLocalStream();

        return () => {
            if (ws.current) {
                ws.current.close();
            }
            if (pc.current) {
                pc.current.close();
            }
        };
    }, []);

    const call = async () => {
        if (pc.current.signalingState === 'stable') {
            const offer = await pc.current.createOffer();
            await pc.current.setLocalDescription(offer);
            ws.current.send(JSON.stringify({ type: 'offer', sdp: offer }));
            console.log('Offer 전송:', offer);
        } else {
            console.error('Cannot call in signaling state:', pc.current.signalingState);
        }
    };

    useEffect(() => {
        if (localVideoRef.current && localStream) {
            localVideoRef.current.srcObject = localStream;
        }
    }, [localStream]);

    useEffect(() => {
        if (remoteVideoRef.current && remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [remoteStream]);

    return (
        <div>
            <video ref={localVideoRef} autoPlay muted />
            <video ref={remoteVideoRef} autoPlay />
            <button onClick={call}>Call</button>
        </div>
    );
};

export default MeetingDetail;

