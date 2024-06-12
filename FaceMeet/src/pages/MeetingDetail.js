import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from "react-router-dom";
import axios from 'axios';


const MeetingDetail = () => {
    const { meeting_id } = useParams();
    const [peers, setPeers] = useState({});
    const [participantCount, setParticipantCount] = useState(0);
    const [nickname, setNickname] = useState('');
    const userVideo = useRef();
    const wsRef = useRef(null);
    const peersRef = useRef({});
    const [connectedUsers, setConnectedUsers] = useState(0);
    const reconnectTimeout = useRef(null);

    useEffect(() => {
        axios.get(`/api/meetings/${meeting_id}/detail/`)
            .then(response => {
                const data = response.data;
                setParticipantCount(data.participant_count);
                setNickname(data.nickname);
            })
            .catch(error => {
                console.error('참가자 데이터를 불러오는 중 에러 발생:', error);
            });
    }, [meeting_id]);

    const createPeerConnection = useCallback((peerID, stream) => {
        console.log('PeerConnection 생성 시도:', peerID);
        const peerConnection = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        });

        stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
        console.log('PeerConnection 생성 완료:', peerID);

        peerConnection.onicecandidate = event => {
            if (event.candidate) {
                console.log('ICE candidate 생성:', event.candidate);
                wsRef.current.send(JSON.stringify({
                    type: 'candidate',
                    target: peerID,
                    candidate: event.candidate
                }));
            }
        };

        peerConnection.ontrack = event => {
            console.log('트랙 수신:', event.streams);
            setPeers(prev => ({ ...prev, [peerID]: event.streams[0] }));
        };

        peerConnection.oniceconnectionstatechange = () => {
            if (peerConnection.iceConnectionState === 'disconnected') {
                console.log('PeerConnection disconnected:', peerID);
                setPeers(prev => {
                    const newPeers = { ...prev };
                    delete newPeers[peerID];
                    return newPeers;
                });
                peerConnection.close();
            }
        };

        peersRef.current[peerID] = peerConnection;

        return peerConnection;
    }, []);

    const handleReceiveOffer = useCallback(async ({ sdp, from }) => {
        console.log('Offer 수신:', from);
        const peerConnection = createPeerConnection(from, userVideo.current.srcObject);
        await peerConnection.setRemoteDescription(new RTCSessionDescription(sdp));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);

        wsRef.current.send(JSON.stringify({
            type: 'answer',
            target: from,
            sdp: answer
        }));

        console.log('Answer 전송:', from);
    }, [createPeerConnection]);

    const createAndSendOffer = useCallback(async (peerID) => {
        console.log(`createAndSendOffer to ${peerID}`);
        const peerConnection = createPeerConnection(peerID, userVideo.current.srcObject);
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        wsRef.current.send(JSON.stringify({
            type: 'offer',
            target: peerID,
            sdp: offer
        }));

        console.log('Offer 전송:', peerID);
    }, [createPeerConnection]);

    const connectWebSocket = useCallback(() => {
        if (wsRef.current) {
            wsRef.current.close();
        }

        const websocket = new WebSocket(`wss://172.20.10.3/ws/meeting/${meeting_id}/`);
        wsRef.current = websocket;

        websocket.onopen = () => {
            console.log('WebSocket 연결 성공');
            if (reconnectTimeout.current) {
                clearTimeout(reconnectTimeout.current);
                reconnectTimeout.current = null;
            }
        };

        websocket.onerror = (error) => {
            console.error('WebSocket 에러:', error);
        };

        websocket.onmessage = function(event) {
            const data = JSON.parse(event.data);
            console.log('WebSocket 메시지 수신:', data);

            switch(data.type) {
                case 'offer':
                    handleReceiveOffer(data);
                    break;
                case 'answer':
                    handleReceiveAnswer(data);
                    break;
                case 'candidate':
                    handleNewICECandidateMsg(data);
                    break;
                case 'connected_users_count':
                    setConnectedUsers(data.count);
                    break;
                case 'join':
                    createAndSendOffer(data.from);
                    break;
                default:
                    console.log('기타 메시지:', data.message);
                    break;
            }
        };

        websocket.onclose = () => {
            console.error('WebSocket 연결이 종료되었습니다. 재연결 시도 중...');
            reconnectTimeout.current = setTimeout(() => connectWebSocket(), 1000);
        };
    }, [meeting_id, createAndSendOffer, handleReceiveOffer]);

    useEffect(() => {
        connectWebSocket();

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
            if (reconnectTimeout.current) {
                clearTimeout(reconnectTimeout.current);
            }
        };
    }, [connectWebSocket]);

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                console.log('미디어 스트림 가져오기 성공:', stream);
                userVideo.current.srcObject = stream;
                wsRef.current.send(JSON.stringify({ type: 'join' }));
            })
            .catch(error => {
                console.error('미디어 장치 접근 중 에러 발생:', error);
            });

        return () => {
            const peersCopy = { ...peersRef.current };
            Object.values(peersCopy).forEach(pc => pc.close());
        };
    }, []);

    const handleReceiveAnswer = ({ sdp, from }) => {
        console.log('Answer 수신:', from);
        const peerConnection = peersRef.current[from];
        if (peerConnection) {
            peerConnection.setRemoteDescription(new RTCSessionDescription(sdp));
            console.log('Answer 처리 완료:', from);
        } else {
            console.error('Answer 처리 실패 - 피어 연결이 존재하지 않음:', from);
        }
    };

    const handleNewICECandidateMsg = ({ candidate, from }) => {
        console.log('ICE Candidate 수신:', from);
        const peerConnection = peersRef.current[from];
        if (peerConnection) {
            peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
            console.log('ICE Candidate 추가 완료:', from);
        } else {
            console.error('ICE Candidate 추가 실패 - 피어 연결이 존재하지 않음:', from);
        }
    };

    return (
        <div>
            <div className='Chatting'>
                {/* Chat messages here */}
            </div>
            <div className='Score'>분위기점수</div>
            <div className='ParticipantsCount'>현재 참가자 수: {participantCount}명</div>
            <div className='ConnectedUsers'>현재 연결된 사용자 수: {connectedUsers}명</div>
            <div className='Camera'>
                <div className='video-container'>
                    <div className='video-wrapper'>
                        <video playsInline muted ref={userVideo} autoPlay className='user-video' />
                        <div className='nickname'>{nickname}</div>
                    </div>
                    {Object.entries(peers).map(([peerID, stream], index) => (
                        <Video key={peerID} stream={stream} index={index} />
                    ))}
                </div>
            </div>
        </div>
    );
};

const Video = ({ stream, index }) => {
    const ref = useRef();

    useEffect(() => {
        if (stream && ref.current) {
            ref.current.srcObject = stream;
            console.log(`Peer ${index + 1}의 스트림 설정`);
        }
    }, [stream, index]);

    return (
        <div className='video-wrapper'>
            <video playsInline autoPlay ref={ref} className='peer-video' />
            <div className='nickname'>Participant {index + 1}</div>
        </div>
    );
}

export default MeetingDetail;
