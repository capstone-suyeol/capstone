import React, { useState } from 'react';
import Layout from '../components/Layout';
import '../components/Style.css';
import { AiFillVideoCamera, AiOutlinePlus, AiOutlineFileSearch } from 'react-icons/ai';

const Modal = ({ onClose, children }) => {
    
    const modalStyle = {
        position: 'fixed',
        width: '15rem',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        zIndex: 1000, // Ensure the modal is on top of other elements
    };

    const closeButtonStyle = {
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
            <button style={closeButtonStyle} onClick={onClose}>Close Modal</button>
        </div>
    );
};
const NewMeetingModal = ({ onClose }) => {
    return (
        <Modal onClose={onClose}>
            <p>새로운 미팅 만들기</p>
        </Modal>
    );
};

// AttendMeetingModal Component
const AttendMeetingModal = ({ onClose }) => {
    return (
        <Modal onClose={onClose}>
            <p>회의 참가하기</p>
        </Modal>
    );
};

// NoteListModal Component
const NoteListModal = ({ onClose }) => {
    // Modal 내용 및 동작 정의
    return (
        <Modal onClose={onClose}>
            <p>노트 목록</p>
        </Modal>
    );
};


function MeetingBefore() {
    const [showNewMeetingModal, setShowNewMeetingModal] = useState(false);
    const [showAttendMeetingModal, setShowAttendMeetingModal] = useState(false);
    const [showNoteListModal, setShowNoteListModal] = useState(false);

    const iconStyle = { color: 'white', fontSize: '50px', marginLeft: '25px', marginTop: '20px' };
    const iconbox = { marginTop: '10px', position: 'relative', marginLeft: '0.5rem' };


    const NewMeeting = () => {
        setShowNewMeetingModal(true);
    };

    const AttendMeeting = () => {
        setShowAttendMeetingModal(true);
    };

    const NoteList = () => {
        setShowNoteListModal(true);

    };

    return (
        <Layout>
            
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="green-box" onClick={NewMeeting}>
                    <div style={iconbox}>
                        <AiFillVideoCamera style={iconStyle} />
                    </div>
                    {/* 첫 번째 상자 */}
                    <p style={{ marginTop: '8rem', marginLeft: '1.6rem', position: 'fixed', fontWeight: 'bold' }}>새 회의</p>
                </div>

                <div className="green-box" onClick={AttendMeeting}>
                    <div style={iconbox}>
                        <AiOutlinePlus style={iconStyle} />
                    </div>
                    {/* 두 번째 상자 */}
                    <p style={{ marginTop: '8rem', marginLeft: '2.6rem', position: 'fixed', fontWeight: 'bold' }}>참가</p>
                </div>

                <div className="green-box" onClick={NoteList}>
                    <div style={iconbox}>
                        <AiOutlineFileSearch style={iconStyle} />
                    </div>
                    {/* 세 번째 상자 */}
                    <p style={{ marginTop: '8rem', marginLeft: '0.3rem', position: 'fixed', fontWeight: 'bold' }}>이전 회의 기록</p>
                </div>
            </div>
            {showNewMeetingModal && <NewMeetingModal onClose={() => setShowNewMeetingModal(false)} />}
            {showAttendMeetingModal && <AttendMeetingModal onClose={() => setShowAttendMeetingModal(false)} />}
            {showNoteListModal && <NoteListModal onClose={() => setShowNoteListModal(false)} />}
        </Layout>
    );
}

export default MeetingBefore;
