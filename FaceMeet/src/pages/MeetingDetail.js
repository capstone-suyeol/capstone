import React, { useEffect, useState, useRef } from 'react';
import '../components/Style.css';
import { useParams } from "react-router-dom";
import axios from 'axios';

const MeetingDetail = () => {
  const { meeting_id } = useParams();

  // 상태 관리
  const [peers, setPeers] = useState({});
  const [participants, setParticipants] = useState([]);
  const [participantCount, setParticipantCount] = useState(0);  // 참가자 수 상태 추가
  const [nickname, setNickname] = useState('');  // 본인 닉네임 상태 추가
  const userVideo = useRef();
  const peersRef = useRef({});
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);

  // 참가자 데이터를 불러오는 useEffect
  useEffect(() => {
    axios.get(`http://localhost:8000/api/meetings/${meeting_id}/detail/`)
      .then(response => {
        const data = response.data;
        setParticipants(data.participants);
        setParticipantCount(data.participant_count);  // 참가자 수 설정
        setNickname(data.nickname);  // 서버에서 닉네임 데이터 가져오기
      })
      .catch(error => {
        console.error('참가자 데이터를 불러오는 중 에러 발생:', error);
      });
  }, [meeting_id]);

  useEffect(() => {
    axios.get(``)
      .then(response => {
        const data = response.data;
        setParticipants(data.participants);
      })
      .catch(error => {
        console.error('참가자 데이터를 불러오는 중 에러 발생:', error);
      });
  }, [meeting_id]);

  // WebSocket 연결 설정
  useEffect(() => {
    const connectWebSocket = () => {
      const websocket = new WebSocket(`ws://localhost:8000/ws/meeting/${meeting_id}/`);
      setWs(websocket);

      websocket.onopen = () => {
        console.log('WebSocket 연결 성공');
      };

      websocket.onerror = (error) => {
        console.error('WebSocket 에러:', error);
      };

      websocket.onmessage = function(event) {
        const data = JSON.parse(event.data);

        // offer, answer, ice-candidate 이벤트 처리
        switch(data.type) {
          case 'offer':
            handleReceiveOffer(data);
            break;
          case 'answer':
            handleReceiveAnswer(data);
            break;
          case 'ice-candidate':
            handleNewICECandidateMsg(data);
            break;
          default:
            setMessages(prevMessages => [...prevMessages, data.message]);
            break;
        }
      };

      websocket.onclose = () => {
        console.error('WebSocket 연결이 종료되었습니다. 재연결 시도 중...');
        setTimeout(() => connectWebSocket(), 1000); // 1초 후 재연결 시도
      };
    };

    connectWebSocket();

    // 컴포넌트 언마운트 시 WebSocket 연결 해제
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [meeting_id]);

  // 사용자 미디어(비디오, 오디오)를 획득하고, 피어 연결을 초기화합니다.
  useEffect(() => {
    if (participants.length > 0) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          userVideo.current.srcObject = stream;
          const connections = {};

          participants.forEach(participant => {
            const peerConnection = createPeerConnection(participant.id, stream);
            connections[participant.id] = peerConnection;
          });

          peersRef.current = connections;
        });

      // 컴포넌트 언마운트 시 모든 피어 연결을 닫습니다.
      return () => {
        Object.values(peersRef.current).forEach(pc => pc.close());
      };
    }
  }, [participants]);

  const createPeerConnection = (peerID, stream) => {
    const peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });

    stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

    peerConnection.onicecandidate = event => {
      if (event.candidate) {
        ws.send(JSON.stringify({
          type: 'ice-candidate',
          target: peerID,
          candidate: event.candidate
        }));
      }
    };

    peerConnection.ontrack = event => {
      setPeers(prev => ({ ...prev, [peerID]: event.streams[0] }));
    };

    peerConnection.createOffer().then(sdp => {
      peerConnection.setLocalDescription(sdp);
      ws.send(JSON.stringify({
        type: 'offer',
        target: peerID,
        sdp: sdp
      }));
    });

    return peerConnection;
  };

  const handleReceiveOffer = async ({ sdp, from }) => {
    const peerConnection = createPeerConnection(from);
    await peerConnection.setRemoteDescription(new RTCSessionDescription(sdp));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    ws.send(JSON.stringify({
      type: 'answer',
      target: from,
      sdp: answer
    }));
  };

  const handleReceiveAnswer = ({ sdp, from }) => {
    const peerConnection = peersRef.current[from];
    peerConnection.setRemoteDescription(new RTCSessionDescription(sdp));
  };

  const handleNewICECandidateMsg = ({ candidate, from }) => {
    const peerConnection = peersRef.current[from];
    peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  };

  // 컴포넌트 렌더링 부분
  return (
    <div>
      <div className='Chatting'>
        {messages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>
      <div className='Score'>분위기점수</div>
      <div className='ParticipantsCount'>현재 참가자 수: {participantCount}명</div> {/* 참가자 수 표시 */}
      <div className='Camera'>
        <div className='video-container'>
          <div className='video-wrapper'>
            <video playsInline muted ref={userVideo} autoPlay className='user-video' />
            <div className='nickname'>{nickname}</div>
          </div>
          {Object.entries(peers).map(([peerID, stream]) => (
            <Video key={peerID} stream={stream} />
          ))}
        </div>
      </div>
    </div>
  );
};

// Video 컴포넌트 정의: 각 피어의 스트림을 비디오 태그로 렌더링합니다.
const Video = ({ stream }) => {
  const ref = useRef();

  useEffect(() => {
    ref.current.srcObject = stream;
  }, [stream]);

  return (
    <div className='video-wrapper'>
      <video playsInline autoPlay ref={ref} className='peer-video' />
      <div className='nickname'>Participant</div>
    </div>
  );
}

export default MeetingDetail;
