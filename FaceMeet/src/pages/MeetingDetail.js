import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from "react-router-dom";
import axios from 'axios';
import kurentoUtils from 'kurento-utils';

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
        // Kurento client 사용
        const options = {
            localVideo: userVideo.current,
            onicecandidate: (candidate) => {
                console.log('ICE candidate 생성:', candidate);
                wsRef.current.send(JSON.stringify({
                    type: 'candidate',
                    target: peerID,
                    candidate: candidate
                }));
            }
        };

        const webRtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerSendrecv(options, function (error) {
            if (error) {
                return console.error('WebRtcPeer 생성 중 에러:', error);
            }

            this.generateOffer((error, offerSdp) => {
                if (error) {
                    return console.error('SDP offer 생성 중 에러:', error);
                }
                console.log('SDP offer 생성:', offerSdp);
                wsRef.current.send(JSON.stringify({
                    type: 'offer',
                    target: peerID,
                    sdp: offerSdp
                }));
            });
        });

        peersRef.current[peerID] = webRtcPeer;
        return webRtcPeer;
    }, []);

    const handleReceiveOffer = useCallback(({ sdp, from }) => {
        console.log('Offer 수신:', from);
        const options = {
            remoteVideo: document.getElementById(`remote-video-${from}`),
            onicecandidate: (candidate) => {
                wsRef.current.send(JSON.stringify({
                    type: 'candidate',
                    target: from,
                    candidate: candidate
                }));
            }
        };

        const webRtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(options, function (error) {
            if (error) {
                return console.error('WebRtcPeer 생성 중 에러:', error);
            }

            this.processAnswer(sdp, (error) => {
                if (error) {
                    return console.error('SDP answer 처리 중 에러:', error);
                }
                console.log('SDP answer 처리 완료:', from);
            });
        });

        peersRef.current[from] = webRtcPeer;
        setPeers((prev) => ({ ...prev, [from]: webRtcPeer }));
    }, []);

    const handleReceiveAnswer = useCallback(({ sdp, from }) => {
        console.log('Answer 수신:', from);
        const webRtcPeer = peersRef.current[from];
        if (webRtcPeer) {
            webRtcPeer.processAnswer(sdp, (error) => {
                if (error) {
                    return console.error('SDP answer 처리 중 에러:', error);
                }
                console.log('SDP answer 처리 완료:', from);
            });
        } else {
            console.error('Answer 처리 실패 - 피어 연결이 존재하지 않음:', from);
        }
    }, []);

    const handleNewICECandidateMsg = useCallback(({ candidate, from }) => {
        console.log('ICE Candidate 수신:', from);
        const webRtcPeer = peersRef.current[from];
        if (webRtcPeer) {
            webRtcPeer.addIceCandidate(candidate, (error) => {
                if (error) {
                    return console.error('ICE Candidate 추가 중 에러:', error);
                }
                console.log('ICE Candidate 추가 완료:', from);
            });
        } else {
            console.error('ICE Candidate 추가 실패 - 피어 연결이 존재하지 않음:', from);
        }
    }, []);

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
                    createPeerConnection(data.from, userVideo.current.srcObject);
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
    }, [meeting_id, createPeerConnection, handleReceiveOffer, handleReceiveAnswer, handleNewICECandidateMsg]);

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
            Object.values(peersCopy).forEach(webRtcPeer => webRtcPeer.dispose());
        };
    }, []);

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
                    {Object.entries(peers).map(([peerID, webRtcPeer], index) => (
                        <Video key={peerID} webRtcPeer={webRtcPeer} index={index} peerID={peerID} />
                    ))}
                </div>
            </div>
        </div>
    );
};

const Video = ({ webRtcPeer, index, peerID }) => {
    const ref = useRef();

    useEffect(() => {
        if (webRtcPeer && ref.current) {
            ref.current.srcObject = webRtcPeer.getRemoteStream();
            console.log(`Peer ${index + 1}의 스트림 설정`);
        }
    }, [webRtcPeer, index]);

    return (
        <div className='video-wrapper'>
            <video playsInline autoPlay ref={ref} id={`remote-video-${peerID}`} className='peer-video' />
            <div className='nickname'>Participant {index + 1}</div>
        </div>
    );
}

export default MeetingDetail;
