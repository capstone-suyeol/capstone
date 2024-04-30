import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Avatar, Button, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';


function MeetingListStyle({ title, avafar, isSelected, onClick = () => { } }) {
    const [meetings, setMeetings] = useState([]);

    useEffect(() => {
        const userId = localStorage.getItem('user_id');
        axios.get(`http://localhost:8000/api/meetings/user-meetings/${userId}/`)
            .then(response => {
                console.log(response.data)
                setMeetings(response.data);
            })
            .catch(error => {
                console.error('Error fetching meetings:', error);
            });
    }, []);

    const handleButtonClick = (meeting_id) => {
        if (typeof onClick === 'function') {
            onClick(); // 함수인 경우에만 호출
            console.log(isSelected);
        }
        window.open(`/MeetingDetail/${meeting_id}`, '_blank');
    };


    return (
        <div>
            {avafar ? (
                <Avatar src={avafar} alt={title} className='custom-MeetingList'
                    sx={{
                        width: '10rem',
                        height: '4rem',
                        borderRadius: '15%',
                        '> img': {
                            border: `2px solid ${grey[500]}`,
                            padding: '1.5px',
                        },
                    }} />
            ) : (
                <Button
                    variant="contained"
                    className={`custom-Button ${isSelected ? 'selected' : ''}`}
                    style={{
                        backgroundColor: isSelected ? '#4CAF50' : '#D0D0D0', // 선택된 버튼은 다른 색상
                        width: '10rem',
                        height: '4rem',
                        borderRadius: '15%',
                        border: `1px solid ${grey[500]}`,
                        padding: '1.5px',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                    }}

                    onClick={handleButtonClick}
                >
                    <Typography variant="body2" align='center' sx={{ color: 'black' }}>
                        {title}
                    </Typography>
                </Button>
            )}
        </div>
    );
}

export default MeetingListStyle;












