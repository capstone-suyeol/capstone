import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import '../components/Profile.css';
import { useNavigate } from 'react-router-dom';

function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        nickname: '',
        email: '',
        username: ''
    });
    const [profilePicture, setProfilePicture] = useState(null);
    const [profilePictureFile, setProfilePictureFile] = useState(null);

    useEffect(() => {
        const accessToken = localStorage.getItem('access_token');
        const userId = localStorage.getItem('user_id');

        if (!accessToken || !userId) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }

        const fetchUser = async () => {
            try {
                const response = await fetch(`https://172.20.10.7/api/users/${userId}/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        alert('토큰이 만료되었습니다. 다시 로그인해주세요.');
                        navigate('/login');
                    } else {
                        throw new Error('사용자 데이터를 가져오는데 실패했습니다.');
                    }
                }

                const data = await response.json();
                setUser({
                    nickname: data.nickname,
                    email: data.email,
                    username: data.email.split('@')[0]
                });
                setProfilePicture(data.profileImage);
            } catch (error) {
                console.error('사용자 데이터를 가져오는데 실패했습니다:', error);
                navigate('/login');
            }
        };

        fetchUser();
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        const userId = localStorage.getItem('user_id');
        const accessToken = localStorage.getItem('access_token');

        try {
            const formData = new FormData();
            formData.append('nickname', user.nickname);
            formData.append('email', user.email);
            if (profilePictureFile) {
                formData.append('profileImage', profilePictureFile);
            }

            const response = await fetch(`https://172.20.10.7/api/users/${userId}/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: formData,
            });

            if (!response.ok) {
                if (response.status === 401) {
                    alert('토큰이 만료되었습니다. 다시 로그인해주세요.');
                    navigate('/login');
                } else {
                    throw new Error('사용자 정보를 업데이트하는데 실패했습니다.');
                }
            }

            const data = await response.json();
            setProfilePicture(data.profileImage);
            alert('정보가 업데이트 되었습니다.');
        } catch (error) {
            console.error('사용자 정보를 업데이트하는데 실패했습니다:', error);
            alert('정보 업데이트에 실패하였습니다.');
        }
    };

    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePictureFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePicture(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Layout>
            <div className="Profile">
                <div className='header'></div>
                <div className='picture'>
                    {profilePicture ? (
                        <img src={profilePicture} alt="Profile" className="profile-img" />
                    ) : (
                        <div className="profile-placeholder"></div>
                    )}
                </div>
                <h1>{user.nickname}</h1>
                <input
                    type="file"
                    id="profilePictureInput"
                    style={{ display: 'none' }}
                    onChange={handleProfilePictureChange}
                />
                <button className="picture-button" onClick={() => document.getElementById('profilePictureInput').click()}>
                    사진 변경
                </button>
                <button className="save" onClick={handleSave}>저장</button>
                <div className='information'>
                    <label>아이디:</label>
                    <input type="text" className="text-input" value={user.username} readOnly /><br></br>
                    <label>닉네임:</label>
                    <input type="text" name="nickname" className="text-input" value={user.nickname} onChange={handleInputChange} /><br></br>
                    <label>이메일:</label>
                    <input type="text" name="email" className="text-input" value={user.email} onChange={handleInputChange} /><br></br>
                </div>
            </div>
        </Layout>
    );
}

export default Profile;