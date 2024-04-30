import React, { useState } from 'react';
import Layout from '../components/Layout';
import '../components/Style.css';
import { AiFillVideoCamera, AiOutlinePlus, AiOutlineFileSearch } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// 모달창 데이터 전달 X
// 스타일 정의 X ( 배경 흐리게 & 하나의 모달창만 뜰 수 있도록 설정)


const Modal = ({ onClose, onConfirm, children }) => {
    const modalStyle = {
        position: 'fixed',
        width: '15rem',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        padding: '40px',
        marginLeft: '10px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
    };

    const closeButtonStyle = {
        width: '60px',
        marginLeft: '40px',
        marginTop: '20px',
        padding: '10px',
        cursor: 'pointer',
        backgroundColor: '#007BFF',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
    };

    return (
        <div style={modalStyle}>
            {children}
            <button style={closeButtonStyle} onClick={onClose}>취소</button>
            <button style={closeButtonStyle} onClick={onConfirm}>확인</button> 
        </div>
    );
};


const NewMeetingModal = ({ onClose }) => {
    const [title, setTitle] = useState('');
    const [meetingId, setMeetingId] = useState('');
    const [password, setPassword] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);
    const userId = localStorage.getItem('user_id'); // 현재 로그인된 사용자의 ID
    const handleSubmit = async (event) => {
        event.preventDefault();  // 폼의 기본 제출 동작을 방지
        try {
            const response = await axios.post('http://localhost:8000/api/meetings/', {
                title: title,
                meeting_id: meetingId,
                password: password,
                host : userId
            });
            console.log('Meeting created:', response.data);
            setShowConfirm(true);
        } catch (error) {
            console.error('Error creating meeting:', error.response.data);
        }
    };

    const handleConfirm = () => {
        console.log('Meeting participation confirmed.');
        onClose();
    };

    return (
        <Modal onClose={onClose} onConfirm={handleSubmit}>
            <p>새 회의 만들기</p>
            <form onSubmit={handleSubmit}>
                <p>Title</p>
                <input
                    type='text'
                    name='title'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <p>Id</p>
                <input
                    type='text'
                    name='id'
                    value={meetingId}
                    onChange={(e) => setMeetingId(e.target.value)}
                />
                <p>Password</p>
                <input
                    type='password'
                    name='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {/* 제출 버튼은 form 태그 내부에 있어야 합니다. */}
            </form>
            {showConfirm && (
                <div style={{ marginTop: "20px" }}>
                    <p>생성되었습니다! 참가하시겠습니까?</p>
                    <button onClick={handleConfirm} style={{ marginRight: '10px' }}>예</button>
                    <button onClick={onClose}>아니오</button>
                </div>
            )}
        </Modal>
    );
};




const AttendMeetingModal = ({ onClose }) => {

    const [meetingId, setMeetingId] = useState('');
    const [password, setPassword] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);
    const userId = localStorage.getItem('user_id'); // 현재 로그인된 사용자의 ID
    const handleSubmit = async (event) => {
        event.preventDefault();  // 폼의 기본 제출 동작을 방지
        try {
            const response = await axios.post('http://localhost:8000/api/meetings/', {
                meeting_id: meetingId,
                password: password,
                host : userId
            });
            console.log('Meeting created:', response.data);
            setShowConfirm(true);
        } catch (error) {
            console.error('Error creating meeting:', error.response.data);
        }
    };

    const handleConfirm = () => {
        console.log('Meeting participation confirmed.');
        onClose();
    };
    return (
        <Modal onClose={onClose}>
            <p>회의 참가하기</p>
            <form>
                <p>Id</p>
                <input
                    type='text'
                    name='id'>
                </input>
                <p>Password</p>
                <input
                    type='text'
                    name='password'>
                </input>
            </form>
        </Modal>
    );
};




function MeetingBefore() {
    const [showNewMeetingModal, setShowNewMeetingModal] = useState(false);
    const [showAttendMeetingModal, setShowAttendMeetingModal] = useState(false);

    const navigate = useNavigate();
    const iconStyle = { color: 'white', fontSize: '50px', marginLeft: '25px', marginTop: '20px' };
    const iconbox = { marginTop: '10px', position: 'relative', marginLeft: '0.5rem' };


    const NewMeeting = () => {
        setShowNewMeetingModal(true);
    };

    const AttendMeeting = () => {
        setShowAttendMeetingModal(true);
    };

    const NoteList = () => {
        navigate('/NoteList');
    };

    return (
        <Layout>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="green-box" onClick={NewMeeting}>
                    <div style={iconbox}>
                        <AiFillVideoCamera style={iconStyle} />
                    </div>
                    {/* 새 회의 버튼 */}
                    <p style={{ marginTop: '8rem', marginLeft: '1.6rem', position: 'fixed', fontWeight: 'bold' }}>새 회의</p>
                </div>

                <div className="green-box" onClick={AttendMeeting}>
                    <div style={iconbox}>
                        <AiOutlinePlus style={iconStyle} />
                    </div>
                    {/* 참가 버튼 */}
                    <p style={{ marginTop: '8rem', marginLeft: '2.6rem', position: 'fixed', fontWeight: 'bold' }}>참가</p>
                </div>

                <div className="green-box" onClick={NoteList}>
                    <div style={iconbox}>
                        <AiOutlineFileSearch style={iconStyle} />
                    </div>
                    {/* 회의 노트 기록 버튼 */}
                    <p style={{ marginTop: '8rem', marginLeft: '0.3rem', position: 'fixed', fontWeight: 'bold' }}>이전 회의 기록</p>
                </div>
            </div>
            {showNewMeetingModal && <NewMeetingModal onClose={() => setShowNewMeetingModal(false)} />}
            {showAttendMeetingModal && <AttendMeetingModal onClose={() => setShowAttendMeetingModal(false)} />}
        </Layout>
    );
}

export default MeetingBefore;