import { Avatar, Button, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';

function MeetingListStyle({ username, avafar }) {
    console.log("avafar:", avafar); // 콘솔에 avafar 출력
    console.log(username);
    return (
        <div>
            {avafar ? (
                <Avatar src={avafar} alt={username} className='custom-MeetingList'
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
                    style={{
                        backgroundColor: '#D0D0D0',
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
                >
                    {/* 이름이 출력되도록 수정 */}
                    <Typography variant="body2" align='center' sx={{ color: 'black' }}>
                        {username}
                    </Typography>
                </Button>
            )}

        </div>
    );
}

export default MeetingListStyle;




