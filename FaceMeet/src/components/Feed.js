import Box from '@mui/material/Box';
import ProfileList from './ProfileList';
import MeetingList from './MeetingList';
import MeetingLogo from './MeetingLogo.png';
import './Style.css';
import { CiMicrophoneOff, CiVideoOff, CiSettings } from "react-icons/ci";


function Feed() {
    return (
        <div className='Layout'>
            <Box
                component="main"
                sx={{
                    display: 'grid',
                    maxHeight: '100vh',
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
                <Box component="section" sx={{ gridColumn: '1 / 2', gridRow: '2 / span 5', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                    <MeetingList sx={{ height: '100%' }} />
                    <Box sx={{
                        position: 'relative',
                        paddingTop: '10%',
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
                                    backgroundColor: '#FF8A00', // 원 모양 도형의 배경색
                                    border: '1px solid white', // 원 모양 도형의 테두리
                                }}
                            />
                        </Box>
                        <div style={{
                            position: 'relative',
                            marginLeft: '27%',
                            marginTop: '-16%',
                            fontWeight: 'bold'
                        }}>홍길동</div>
                        
                        <div style = {{
                            fontSize: '0.8rem',
                            position: 'relative',
                            marginLeft: '27%',
                            marginTop: '0%',
                            fontWeight: 'bold'
                        }}> 온라인 </div>

                            <div id='mic'><CiMicrophoneOff /> </div>

                            <div id='video'> <CiVideoOff /> </div>

                            <div id='setting'><CiSettings /> </div>
                    </Box>
                </Box>

                {/* MeetingLogo Section (Top-left corner) */}
                <Box component="section" sx={{ gridColumn: '1 / 2', gridRow: '1 / 2', display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', marginLeft: '1rem', marginTop: '1rem' }}>
                    <img src={MeetingLogo} alt="Meeting 로고" style={{ width: '14rem', height: '8rem', marginLeft: '5%' }} />
                </Box>


                <p style={{ position: 'absolute', marginLeft: '21%', marginTop: '7.9%' }}>이름</p>
                {/* ProfileList Section */}
                <Box component="section" sx={{ gridColumn: '3 / 80 ', gridRow: '1 / span 1', display: 'flex', alignItems: 'center' }}>
                    {/* 사용자의 프로필 - 데이터 받아서 이미지 뜨도록 하는 코드 필요*/}
                    <Box sx={{
                        position: 'relative',
                        backgroundColor: 'grey',
                        width: '5rem',
                        height: '5rem',
                        borderRadius: '15%',
                        marginRight: '2%',

                    }} />
                        <ProfileList />
                    </Box>
                </Box>
        </div>
    );
}

export default Feed;



