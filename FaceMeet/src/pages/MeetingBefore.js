import React from 'react';
import Feed from '../components/Feed';
import Box from '@mui/material/Box';

// feed로 인해 텍스트가 가려져서 안보임

function MeetingBefore() {
    return (
        <Feed>
            <Box
                component="div"
                sx={{
                    fontSize: '56px',
                    color: 'red',
                    alignItems: 'center',
                }}
            >
                회의전
            </Box>
        </Feed>
    );
}

export default MeetingBefore;
