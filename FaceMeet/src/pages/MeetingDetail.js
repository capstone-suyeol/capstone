import React, { useEffect, useState } from 'react';
import '../components/Style.css';

function MeetingDetail() {
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);
  // 데어터 전달 X 레이아웃만 잡아둠

  useEffect(() => {
    const websocket = new WebSocket("ws://my-django-app.com/ws/chat/");
    setWs(websocket);
  }, []);

  useEffect(() => {
    if (ws) {
      ws.onmessage = function (event) {
        const message = JSON.parse(event.data).message;
        setMessages(prevMessages => [...prevMessages, message]);
      };
    }
  }, [ws]);

  return (

    <div>
      <div className='Chatting'>
        {messages.map((message, index) => (
        <div key={index}>{message}</div>
      ))} </div>
      <div className='Score'>분위기점수</div>
      <div className='Camera'>카메라
        <div className='두명1 '> 두 명일 때 </div>
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
}

export default MeetingDetail;