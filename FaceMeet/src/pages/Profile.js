import React from 'react';
import Layout from '../components/Layout';
import '../components/Profile.css';

import { useNavigate } from 'react-router';
import { Box } from '@mui/material';

function Profile() {
  return (
    <Layout>
      <div class="Profile box">
        <h1>
          <h2>
            <p1>이재원</p1>
            <button class="picture">사진 변경</button>
            <button class="save">저장</button>
          </h2>
          <h3></h3>
          <h4>
            <p2>
            아이디
            <input type="text" class="text-input" placeholder="jawon2do"></input><br /><br />
            닉네임
            <input type="text" class="text-input" placeholder="이재원"></input><br /><br />
            이메일
            <input type="text" class="text-input" placeholder="wodnjsgidrl@gmail.com"></input>
            </p2>
          </h4>
        </h1>
      </div>
    </Layout>
  );
}

export default Profile;