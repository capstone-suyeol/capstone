import { useEffect, useState } from 'react';
import { faker } from '@faker-js/faker';
import { Box } from '@mui/material';
import { grey } from '@mui/material/colors';
import MeetingListStyle from './MeetingListStyle';

function MeetingList() {
    const [MeetingList, setMeetingList] = useState();  // 변수 이름 변경

    /* 해당 회의 사진이 없을 경우 회의 이름이 사진으로 뜨게끔 설정해야함. */


    useEffect(() => {
        const list = [...Array(4)].map((_, i) => ({
            username: faker.name.findName(),
            name: faker.name.firstName(),
            phone: faker.phone.number(),
            address: faker.address.country(),
            website: faker.internet.url(),
            avafar: faker.internet.avatar(),
            id: i,
        }));

        setMeetingList(list);
    }, []);

    if (!MeetingList) return <div>loading</div>;


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
            {MeetingList.map((Meeting) => (
                <MeetingListStyle key={Meeting.id} username={Meeting.username} />
            ))}

        </Box>
    );
}

export default MeetingList;