import Box from '@mui/material/Box';
import ProfileList from './ProfileList';
import MeetingList from './MeetingList';
import MeetingLogo from './MeetingLogo.png';
import './Style.css';

function Feed() {
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
                <Box component="section" sx={{ gridColumn: '1 / 2', gridRow: '2 / span 5', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                    <MeetingList sx={{ height: '100%' }} />
                </Box>

                {/* MeetingLogo Section (Top-left corner) */}
                <Box component="section" sx={{ gridColumn: '1 / 2', gridRow: '1 / 2', display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', marginLeft: '1rem', marginTop: '1rem' }}>
                    <img src={MeetingLogo} alt="Meeting 로고" style={{ width: '14rem', height: '8rem', marginLeft: '5%' }} />
                </Box>

                {/* ProfileList Section */}
                <Box component="section" sx={{ gridColumn: '2 / 7', gridRow: '1 / span 1', display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ flex: 1 }}>
                        <ProfileList />
                    </Box>
                </Box>
            </Box>
        </div>
    );
}

export default Feed;

