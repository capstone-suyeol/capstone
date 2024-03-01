import React from 'react';
import Layout from '../components/Layout';
import '../components/Style.css';
import { AiOutlineFileSearch } from 'react-icons/ai';
import { useNavigate } from 'react-router';

function NoteList() {

  // 데이터 전달 X 

  const navigate = useNavigate();
  const iconStyle = { color: 'white', fontSize: '5rem', marginLeft: '1.2rem', marginTop: '0.8rem' };
  const iconbox = { Position: 'fixed', marginTop: '10px', position: 'relative', marginLeft: '0.5rem' };
  const Back = () => {
    navigate('/');
  };

  return (
    <Layout>
      <div className='NoteButton' onClick={Back}>
        <div style={iconbox}>
          <AiOutlineFileSearch style={iconStyle} />
        </div>
        <p style={{ marginTop: '2rem', marginLeft: '0.8rem', position: 'fixed', fontWeight: 'bold' }}>회의 노트 목록</p>
      </div>

      <div className='NoteList'>
        <p>날짜</p>
        <p>시간</p>
        <p>이름</p>
        <p>분위기점수</p>
        <p>다시보기</p>
        </div>

    </Layout>
  );
}

export default NoteList;