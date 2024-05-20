import React, { useEffect, useState, useRef } from 'react';
import '../components/Style.css';
import { useParams } from "react-router-dom";
import axios from 'axios';


const MeetingDetail = () => {
  const { meeting_id } = useParams();

  // 상태 관리: peers (각 피어의 스트림 저장), ws (WebSocket 연결), messages (채팅 메시지 배열)
  const [peers, setPeers] = useState({});
  const [meeting, setMeetingId] = useState({});
  const [participants, setParticipants] = useState([]); // 참가자 목록을 저장할 상태
  const userVideo = useRef(); // 사용자 자신의 비디오 스트림을 참조
  const peersRef = useRef({}); // 연결된 피어들의 참조를 저장
  const [ws, setWs] = useState(null); // WebSocket 연결 상태
  const [messages, setMessages] = useState([]); // 채팅 메시지들을 저장하는 배열



  useEffect(() => {
    axios.get(`http://localhost:8000/api/participants/${meeting_id}`)
      .then(response => {
        const data = response.data;
        console.log(data);
        setParticipants(data);
      })
      .catch(error => {
        console.error('참가자 데이터를 불러오는 중 에러 발생:', error);
      });

  }, []);


  useEffect(() => {
    const websocket = new WebSocket(`ws://localhost:8001/ws/meeting/${meeting_id}/`);
    setWs(websocket);
  }, []);

  // WebSocket 메시지 수신 시 메시지 상태를 업데이트합니다.
  useEffect(() => {
    if (ws) {
      ws.onmessage = function (event) {
        const message = JSON.parse(event.data).message;
        setMessages(prevMessages => [...prevMessages, message]);
      };
    }
  }, [ws]);

  // 사용자 미디어(비디오, 오디오)를 획득하고, 피어 연결을 초기화합니다.
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        userVideo.current.srcObject = stream; // 비디오 태그에 스트림을 연결
        const connections = {}; // 피어 연결을 저장할 객체

        // 초기 피어 목록, 이는 실제 사용 시 업데이트되어야 합니다.
        const initialPeers = ['peer1', 'peer2', 'peer3'];
        initialPeers.forEach(peerID => {
          const peerConnection = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
          });
          stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

          // ICE 후보 수집 이벤트 처리
          peerConnection.onicecandidate = event => {
            if (event.candidate) {
              // 후보를 다른 피어에게 전송할 필요가 있습니다.
            }
          };

          // 원격 스트림 수신 시 처리
          peerConnection.ontrack = event => {
            if (!peersRef.current[peerID]) {
              peersRef.current[peerID] = event.streams[0];
              setPeers(prev => ({ ...prev, [peerID]: event.streams[0] }));
            }
          };

          // SDP 오퍼 생성 및 로컬 설명 설정
          peerConnection.createOffer().then(sdp => {
            peerConnection.setLocalDescription(sdp);
            // SDP를 다른 피어에게 전송해야 합니다.
          });

          connections[peerID] = peerConnection; // 연결 저장
        });

        peersRef.current = connections; // 참조 업데이트
      });

    // 컴포넌트 언마운트 시 모든 피어 연결을 닫습니다.
    return () => {
      Object.values(peersRef.current).forEach(pc => pc.close());
    };
  }, []);

  // 컴포넌트 렌더링 부분
  return (
    <div>
      <div className='Chatting'>
        {messages.map((message, index) => (
          <div key={index}>{message}</div>
        ))} </div>
      <div className='Score'>분위기점수</div>
      <div className='Camera'>카메라
        <div className='두명1 '>
          <video playsInline muted ref={userVideo} autoPlay style={{ width: "40rem" }} />
          {Object.entries(peers).map(([peerID, stream]) => (
            <Video key={peerID} stream={stream} />
          ))}
        </div>
        <div className='두명2 '> 두 명일 때 </div>
        <div className='세명1 '> 세 명일 때 </div>
        <div className='세명2 '> 세 명일 때 </div>
        <div className='세명3 '> 세 명일 때 </div>
        <div className='네명1 '> 네 명일 때 </div>
        <div className='네명2 '> 네 명일 때 </div>
        <div className='네명3 '> 네 명일 때 </div>
        <div className='네명4 '> 네 명일 때 </div>
      </div>

    </div>

  );
};

// Video 컴포넌트 정의: 각 피어의 스트림을 비디오 태그로 렌더링합니다.
const Video = ({ stream }) => {
  const ref = useRef();

  useEffect(() => {
    ref.current.srcObject = stream; // 비디오 태그에 스트림 연결
  }, [stream]);



  return (
    <video playsInline autoPlay ref={ref} />
  );
}
export default MeetingDetail;