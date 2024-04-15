import React, { useState } from 'react';
import background from '../login_background.png';
import logo from '../Logo.png';
import '../Login.css';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(''); // 이메일 상태 관리
  const [password, setPassword] = useState(''); // 비밀번호 상태 관리

  const handleLogin = async () => {
    // 로그인 요청을 보내는 코드
    try {
      const response = await fetch('http://127.0.0.1:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (response.ok) {
        // 성공적으로 로그인 됐을 때의 로직
        navigate('/');
      } else {
        // 로그인 실패 처리
        alert('로그인 실패');
      }
    } catch (error) {
      console.error('로그인 요청 중 에러 발생:', error);
    }
  };

  return (
    <div className="Before">
      <img src={background} alt="로그인 배경 이미지" />
      <box>
        <logo><img src={logo} alt="로고"></img></logo>
        <box2>
          <input
            type="text"
            name="userName"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          >
          </input>
        </box2>
        <box3>
          <input
            type="password"
            name="userPassword"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}>
          </input>
        </box3>

        <button id="idButton" style={{color: '#7C7C7C'}} onClick={handleLogin}>로그인</button>

        <text1>______________  또는  ______________</text1>

        <button id="kakaoButton" style={{color: '#7C7C7C'}}>카카오톡으로 로그인</button>

        <span onClick={handleLogin}>회원가입</span>
        <span onClick={handleLogin}>아이디 찾기</span>
        <span onClick={handleLogin}>비밀번호 찾기</span>
      </box>
    </div>
  );
}

export default Login;