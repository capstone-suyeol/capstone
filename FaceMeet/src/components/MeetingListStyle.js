<<<<<<< HEAD
import React from 'react';
import { Avatar, Button, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';

// 활성화 된 버튼 색상 변경 안됨
// 로그인한 유저 프로필 데이터 X

function MeetingListStyle({ title, avafar, isSelected, onClick = () => { } }) {
    const handleButtonClick = () => {
        if (typeof onClick === 'function') {
            onClick(); // 함수인 경우에만 호출
            console.log(isSelected);
        }
        window.open('/MeetingDetail', '_blank');
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












=======
import React from 'react';
import { Avatar, Button, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';

// 활성화 된 버튼 색상 변경 안됨
// 로그인한 유저 프로필 데이터 X

function MeetingListStyle({ title, avafar, isSelected, onClick = () => { } }) {
    const handleButtonClick = () => {
        if (typeof onClick === 'function') {
            onClick(); // 함수인 경우에만 호출
            console.log(isSelected);
        }
        window.open('/MeetingDetail', '_blank');
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












>>>>>>> fdfb8f3 (표정인식-음성텍스트변환 복구)
