import React from 'react';

import {Button, Typography } from '@mui/material';


function MeetingListStyle({ meeting, onClick = () => {} }) {
    const handleButtonClick = () => {
        if (typeof onClick === 'function') {
            onClick(meeting);
        }
        console.log(meeting.meeting_id);
        window.open(`/MeetingDetail/${meeting.meeting_id}`, '_blank');
    };

    return (
        <Button
            key={meeting.meeting_id}
            variant="contained"
            className={`custom-Button`}
            style={{
                backgroundColor: '#97F7B8',
                marginTop: '1rem',
                width: '10rem',
                height: '4rem',
                borderRadius: '10%',
                border: `none`,
                padding: '1.5px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                fontWeight: 'bold'
            }}
            sx={{
                '&:hover': {
                    backgroundColor: '#2a9551 !important',
                },
            }}
            onClick={handleButtonClick}
        >
            <Typography variant="body2" align='center' sx={{ color: 'black' }}>
                {meeting.title || 'No Title'}
            </Typography>
        </Button>
    );
}

export default MeetingListStyle;
