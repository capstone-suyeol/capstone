import React, { useState } from 'react';
import background from '../login_background.png'; // 배경 이미지를 가져옵니다.
import logo from '../Logo.png'; // 로고 이미지를 가져옵니다.
import '../Login.css'; // 스타일을 가져옵니다.
import { useNavigate } from 'react-router-dom'; // 페이지 이동을 위한 훅을 가져옵니다.
import { jwtDecode } from 'jwt-decode'; // jwt-decode 라이브러리에서 jwt_decode 함수 가져오기


function Login() {
  const navigate = useNavigate(); // 페이지 이동 함수를 초기화합니다.
  const [email, setEmail] = useState(''); // 이메일 입력을 위한 상태를 설정합니다.
  const [password, setPassword] = useState(''); // 비밀번호 입력을 위한 상태를 설정합니다.

  // 로그인 시도를 처리하는 함수입니다.
  const handleLogin = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
  
      const data = await response.json();  // 서버로부터 응답을 JSON 형태로 받습니다.
  
      if (response.ok) {
        const { access } = data; // 액세스 토큰 가져오기
        const tokenPayload = jwtDecode(access); // JWT 디코딩하여 페이로드 가져오기
        const userID = tokenPayload.user_id; // 사용자 ID 추출
        localStorage.setItem('user_id', userID); // 사용자 ID를 로컬 스토리지에 저장
        localStorage.setItem('access_token', data.access);  // 액세스 토큰을 로컬 스토리지에 저장
        localStorage.setItem('refresh_token', data.refresh);  // 리프레시 토큰을 로컬 스토리지에 저장
        navigate('/');  // 홈페이지로 이동
      } else if (response.status === 401) {
        alert(data.error);  // 오류 메시지 출력
      } else {
        alert('로그인 실패');
      }
    } catch (error) {
      console.error('로그인 요청 중 에러 발생:', error);
      alert('로그인 요청 중 에러 발생');
    }
  };
  
  
  // 회원가입 버튼 클릭을 처리하는 함수입니다.
  const handleJoinClick = () => {
    navigate('/join'); // 회원가입 페이지로 이동합니다.
  };

  return (
    <div className="Before"> {/* 메인 컨테이너 */}
      <img src={background} alt="로그인 배경 이미지" /> {/* 배경 이미지 */}
      <box> {/* 로그인 폼을 위한 컨테이너 */}
        <logo><img src={logo} alt="로고"></img></logo> {/* 로고 */}
        <box2> {/* 이메일 입력을 위한 컨테이너 */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          >
          </input>
        </box2>
        <box3> {/* 비밀번호 입력을 위한 컨테이너 */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}>
          </input>
        </box3>

        <button id="idButton" style={{color: '#7C7C7C'}} onClick={handleLogin}>로그인</button> {/* 로그인 버튼 */}

        <text1>______________  또는  ______________</text1> {/* 또는 구분선 */}

        <button id="kakaoButton" style={{color: '#7C7C7C'}}>카카오톡으로 로그인</button> {/* 카카오톡으로 로그인 버튼 */}

        {/* 회원가입 버튼 */}
        <span id="joinButton" onClick={handleJoinClick}>회원가입</span>
        
        {/* 아이디 및 비밀번호 찾기 링크 */}
        <span onClick={handleLogin}>아이디 찾기</span>
        <span onClick={handleLogin}>비밀번호 찾기</span>
      </box>
    </div>
  );
}

export default Login;
