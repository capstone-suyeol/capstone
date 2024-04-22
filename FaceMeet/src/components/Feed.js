import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import axios from 'axios';
import ProfileList from './ProfileList';
import MeetingList from './MeetingList';
import MeetingLogo from './MeetingLogo.png';
import './Style.css';
import { CiMicrophoneOff, CiVideoOff, CiSettings } from "react-icons/ci";

// 해당 유저의 프로필 가져오는 코드 필요 **

function Feed() {
    const navigate = useNavigate();

    const [profileList, setProfileList] = useState();

    useEffect(() => {
        axios.get('/testData.json')
            .then(response => {
                const data = response.data.User;
                console.log(data);
                setProfileList(data);
            })
            .catch(error => {
                console.error('데이터를 불러오는 중 에러 발생:', error);
            });
    }, []);


    if (!profileList) {
        return <div>Loading...</div>;
    }


    return (
        <div className='Layout'>
            <Box
                component="main"
                sx={{
                    display: 'grid',
                    maxHeight: '93vh',
                    gridTemplateColumns: {
                        xs: 'repeat(6, 1fr)',
                        sm: 'repeat(6, 1fr)',
                        md: 'repeat(6, 1fr)',
                    },
                    gridTemplateRows: {
                        xs: 'repeat(6, 1fr) minmax(0, 1fr) repeat(4, 1fr)',
                        sm: 'repeat(6, 1fr)',
                        md: 'repeat(6, 1fr)',
                    },
                    columnGap: '1rem',
                    marginX: 'auto',
                    marginY: 'auto',
                }}
            >
                {/* MeetingList Section */}
                <Box component="section" sx={{ gridColumn: '1 / 2', gridRow: '2 / 6', display: 'fle', flexDirection: 'column', justifyContent: 'flex-end' }}>
                    <MeetingList sx={{ height: '100%' }} />
                    <Box sx={{
                        position: 'relative',
                        paddingTop: '3%',
                        width: '16.3rem',
                        height: '10rem',
                    }} >
                        <Box sx={{
                            position: 'relative',
                            backgroundColor: 'grey',
                            marginLeft: '4%',
                            marginTop: '1.5%',
                            width: '3rem',
                            height: '3rem',
                            borderRadius: '15%',

                        }} >

                            <Box
                                sx={{
                                    position: 'absolute',
                                    bottom: '0',
                                    right: '0',
                                    width: '17px',
                                    height: '17px',
                                    borderRadius: '50%',
                                    backgroundColor: profileList && profileList.length > 0 && profileList[0].state ? '#4EE080' : '#FF8A00',
                                    border: '1px solid white', // 원 모양 도형의 테두리
                                }}
                            />
                        </Box>
                        <div style={{
                            position: 'relative',
                            marginLeft: '27%',
                            marginTop: '-16%',
                            fontWeight: 'bold'
                        }}>
                            {profileList && profileList.length > 0 && profileList[0].name}
                        </div>

                        {profileList && profileList.length > 0 && (
                            <div style={{
                                fontSize: '0.8rem',
                                position: 'relative',
                                marginLeft: '27%',
                                marginTop: '0%',
                                fontWeight: 'bold'
                            }}>
                                {profileList[0].state ? '온라인' : '오프라인'}
                            </div>
                        )}


                        <div id='mic'><CiMicrophoneOff /> </div>

                        <div id='video'> <CiVideoOff /> </div>

                        <div id='setting' onClick={() => navigate('/NoteDetail')}><CiSettings /> </div>
                    </Box>
                </Box>


                {/* MeetingLogo Section (Top-left corner) */}
                <Box component="section" sx={{ gridColumn: '1 / 2', gridRow: '1 / 2', display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', marginLeft: '1rem', marginTop: '1rem' }}>
                    <img src={MeetingLogo} alt="Meeting 로고" style={{ width: '14rem', height: '8rem', marginLeft: '5%' }} onClick={() => navigate('/')} />
                </Box>

                <Box sx = {{ gridColumn: '2 / -1'}}>
                    <ProfileList />
                </Box>
            </Box>
        </div>
    );
}

export default Feed;
