import React from 'react';
import background from '../login_background.png';
import logo from '../Logo.png';
import '../Login.css'
import { useNavigate } from 'react-router-dom';

function Login() {

  const navigate = useNavigate();
  // eslint-disable-next-line
  const idButton = document.getElementById('idButton');
  const home = () => {
    navigate('/');
  };
  const handleTextClick = () => {
    console.log('텍스트가 클릭되었습니다.');
  };

  return (
    <div className="Before">
      <img src={background} alt="로그인 배경 이미지" ></img>
      <box>
        <logo><img src={logo} alt="로고"></img></logo>
        <box2><input type="text" name="userName" placeholder="Email"></input></box2>
        <box3><input type="password" name="userPassword" placeholder="Password"></input></box3>

        <button id="idButton" style={{color: '#7C7C7C'}} onclick={home}>로그인</button>

        <text1>______________  또는  ______________</text1>

        <button id="kakaoButton" style={{color: '#7C7C7C'}}>카카오톡으로 로그인</button>

        <span onclick={handleTextClick}>회원가입</span>
        <span onclick={handleTextClick}>아이디 찾기</span>
        <span onclick={handleTextClick}>비밀번호 찾기</span>
      </box>
    </div>
  );
}

export default Login;