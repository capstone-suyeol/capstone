import { useEffect, useState } from 'react';
import axios from 'axios';
import { Box } from '@mui/material';
import { grey } from '@mui/material/colors';
import MeetingListStyle from './MeetingListStyle';


function MeetingList() {

    const [meetings, setMeetingList] = useState([]);  // 변수 이름 변경

    /* 해당 회의 사진이 없을 경우 회의 이름이 사진으로 뜨게끔 설정해야함. */

    useEffect(() => {
        const userId = localStorage.getItem('user_id');
        axios.get(`/api/meetings/user-meetings/${userId}/`)
            .then(response => {
                const data = response.data;
                console.log(data);
                setMeetingList(data);
            })
            .catch(error => {
                console.error('데이터를 불러오는 중 에러 발생:', error);
            });

    }, []);

    /*    const list = [...Array(4)].map((_, i) => ({
            username: faker.name.findName(),
            name: faker.name.firstName(),
            phone: faker.phone.number(),
            address: faker.address.country(),
            website: faker.internet.url(),
            avafar: faker.internet.avatar(),
            id: i,
        }));
    
        setMeetingList(list);
    }, []);*/

    if (!meetings) return <div>loading</div>;


    return (
        <Box
            sx={{
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                marginBottom: '1rem',
                height: '100%',
                width: '87.5%',
                padding: '1.5rem',
                overflowY: 'auto', // 영역이 부족할 때만 스크롤 허용
                border: `1px solid ${grey[200]}`,
                borderRadius: '2px',
                '> div + div': {
                    marginTop: '0.5rem',
                },
                '> img': {
                    width: '50px',
                    height: '50px',
                    borderRadius: '15%',
                    objectFit: 'cover',
                },
                '> span + span': {
                    marginLeft: '0.5rem',
                },
            }}
        >
            {meetings.map((meeting) => (
                <MeetingListStyle key={meeting.meeting_id} meeting={meeting} />
            ))}

        </Box>
    );
}

export default MeetingList;