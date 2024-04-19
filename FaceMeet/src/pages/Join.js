import React, { useState } from 'react';
import '../Join.css'; // 스타일 파일 임포트
import background from '../login_background.png';

function Join() {
    const [email, setEmail] = useState('');
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'email') setEmail(value);
        else if (name === 'nickname') setNickname(value);
        else if (name === 'password') setPassword(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = { email, nickname, password };

        try {
            const response = await fetch('http://localhost:8000/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            const data = await response.json();
            if (response.status === 201) {
                alert('회원가입 성공!');
            } else {
                alert(`회원가입 실패: ${data.error}`);
            }
        } catch (error) {
            alert('회원가입 요청에 실패했습니다.');
            console.error('회원가입 에러:', error);
        }
    };

    return (
      <div className="Before">
        <img src={background} alt="로그인 배경 이미지" />
        <div className="join-container">
            <h2>회원가입</h2>

            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label>Email:</label>
                    <input type="email" name="email" value={email} onChange={handleInputChange} required />
                </div>
                <div className="input-group">
                    <label>Nickname:</label>
                    <input type="nickname" name="nickname" value={nickname} onChange={handleInputChange} required />
                </div>
                <div className="input-group">
                    <label>Password:</label>
                    <input type="password" name="password" value={password} onChange={handleInputChange} required />
                </div>
                <button type="submit">회원가입</button>
            </form>
        </div>
        </div>
    );
}

export default Join;
