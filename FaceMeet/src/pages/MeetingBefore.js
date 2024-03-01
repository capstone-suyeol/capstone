import React, { useState } from 'react';
import Layout from '../components/Layout';
import '../components/Style.css';
import { AiFillVideoCamera, AiOutlinePlus, AiOutlineFileSearch } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

const Modal = ({ onClose, children }) => {

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
            <button style={closeButtonStyle}> 확인 </button>
        </div>
    );
};


const NewMeetingModal = ({ onClose }) => {
    return (
        <Modal onClose={onClose}>
            <p>새로운 미팅 만들기</p>
            <form>
                <p>Title</p>
                <input
                    type='text'
                    name='title'>
                </input>
                <p>Id</p>
                <input
                    type='text'
                    name='id'>
                </input>
            </form>
        </Modal>
    );
};


const AttendMeetingModal = ({ onClose }) => {
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
