import React from 'react';
import Layout from '../components/Layout';
import '../components/Style.css';

function MeetingDetail() {


  return (

    <Layout>
      <div className='Chatting'>채팅 (리스트로 뿌리기) </div>
      <div className='Score'>분위기점수</div>
      <div className='Camera'>카메라</div>
      <div className='두명1 '> 두 명일 때 </div>
      <div className='두명2 '> 두 명일 때 </div>
      <div className='세명1 '> 세 명일 때 </div>
      <div className='세명2 '> 세 명일 때 </div>
      <div className='세명3 '> 세 명일 때 </div>
      <div className='네명1 '> 네 명일 때 </div>
      <div className='네명2 '> 네 명일 때 </div>
      <div className='네명3 '> 네 명일 때 </div>
      <div className='네명4 '> 네 명일 때 </div>

    </Layout>
  );
}

export default MeetingDetail;