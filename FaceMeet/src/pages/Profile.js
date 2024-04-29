import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import '../components/Profile.css'; // CSS 파일 임포트
import { useNavigate } from 'react-router-dom';

function Profile() {
<<<<<<< HEAD
  const navigate = useNavigate();
  const [user, setUser] = useState({
      nickname: '',
      email: '',
      username: ''
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
      const accessToken = localStorage.getItem('access_token');
      const userId = localStorage.getItem('user_id'); // Retrieve the user ID from local storage

      if (!accessToken || !userId) {
          alert('로그인이 필요합니다.');
          navigate('/login');
          return;
      }

      const fetchUser = async () => {
          try {
              const response = await fetch(`http://127.0.0.1:8000/api/users/${userId}/`, { // Use user ID dynamically
                  method: 'GET',
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${accessToken}`,
                  },
              });

              if (!response.ok) {
                  throw new Error('Failed to fetch user data');
              }

              const data = await response.json();
              setUser({
                  nickname: data.nickname,
                  email: data.email,
                  username: data.email.split('@')[0]
              });
              setIsLoggedIn(true);
          } catch (error) {
              console.error('Failed to fetch user:', error);
              setIsLoggedIn(false);
              navigate('/login'); // Redirect to login if there is an error fetching user data
          }
      };

      fetchUser();
  }, [navigate]);
=======
    const navigate = useNavigate();
    const [user, setUser] = useState({
        nickname: '',
        email: '',
        username: ''
    });
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const accessToken = localStorage.getItem('access_token');
        const userId = localStorage.getItem('user_id'); // Retrieve the user ID from local storage

        if (!accessToken || !userId) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }

        const fetchUser = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/users/${userId}/`, { // Use user ID dynamically
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }

                const data = await response.json();
                setUser({
                    nickname: data.nickname,
                    email: data.email,
                    username: data.email.split('@')[0]
                });
                setIsLoggedIn(true);
            } catch (error) {
                console.error('Failed to fetch user:', error);
                setIsLoggedIn(false);
                navigate('/login'); // Redirect to login if there is an error fetching user data
            }
        };

        fetchUser();
    }, [navigate]);
>>>>>>> fdfb8f3 (표정인식-음성텍스트변환 복구)

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser(prev => ({
            ...prev,
            [name]: value
        }));
    };
<<<<<<< HEAD

    const handleSave = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/users/1/`, {
=======
    const userId = localStorage.getItem('user_id'); // Retrieve the user ID from local storage
    const handleSave = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/users/${userId}/`, {
>>>>>>> fdfb8f3 (표정인식-음성텍스트변환 복구)
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
                body: JSON.stringify({
                    nickname: user.nickname,
                    email: user.email
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update user');
            }

            alert('정보가 업데이트 되었습니다.');
            navigate('/');
        } catch (error) {
            console.error('Failed to save user:', error);
            alert('정보 업데이트에 실패하였습니다.');
        }
    };

    return (
<<<<<<< HEAD
      <Layout>
          <div className="Profile">
              <h1>프로필 정보 ({isLoggedIn ? '로그인 상태' : '로그인 필요'})</h1>
              <div>
                  <button className="picture" onClick={() => alert('사진 변경 기능은 현재 구현되지 않았습니다.')}>사진 변경</button>
                  <button className="save" onClick={handleSave}>저장</button>
                  <div>
                      <label>아이디:</label>
                      <input type="text" className="text-input" value={user.username} readOnly />
                      <label>닉네임:</label>
                      <input type="text" name="nickname" className="text-input" value={user.nickname} onChange={handleInputChange} />
                      <label>이메일:</label>
                      <input type="text" name="email" className="text-input" value={user.email} onChange={handleInputChange} />
                  </div>
              </div>
          </div>
      </Layout>
  );
}

export default Profile;
=======
        <Layout>
            <div className="Profile">
                <div className='header'></div>
                <div className='picture'></div>
                <h1>{user.nickname}</h1>
                <button className="picture-button" onClick={() => alert('사진 변경 기능은 현재 구현되지 않았습니다.')}>사진 변경</button>
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
>>>>>>> fdfb8f3 (표정인식-음성텍스트변환 복구)
