import { useEffect, useState } from 'react';
import { faker } from '@faker-js/faker';
import { Box } from '@mui/material';
import logo from '../dog.svg';
import { grey } from '@mui/material/colors';
import ProfileListStyle from './ProfileListStyle';

function ProfileList() {
    const [profileList, setProfileList] = useState();  // 변수 이름 변경

    /* 친구 목록에서 친구의 프로필과 이름을 가져올 수 있어야 함. */

    useEffect(() => {
        const list = [...Array(10)].map((_, i) => ({
            username: faker.name.findName(),
            name: faker.name.firstName(),
            phone: faker.phone.number(),
            address: faker.address.country(),
            website: faker.internet.url(),
            avafar: faker.internet.avatar(),
            id: i,
        }));

        setProfileList(list);
    }, []);

    if (!profileList) return <div>loading</div>;
    

    return (
        <Box
            sx={{
                display: 'flex',
                padding: '1.5rem',
                overflowX: 'auto', // 친구가 많아서 영역이 부족할 때만 스크롤 허용
                border: `1px solid ${grey[200]}`,
                borderRadius: '2px',
                '> div + div': {
                    marginLeft: '0.5rem',
                },
                '> img': {
                    width: '50px',
                    height: '50px',
                    borderRadius: '15%',
                    objectFit: 'cover',
                },
                '> span': {
                    marginLeft: '0.5rem',
                },
            }}
        >
            {profileList.map((Profile) => (
                <ProfileListStyle key={Profile.id} avafar={logo} username={Profile.username} />
            ))}

        </Box>
    );
}

export default ProfileList;
