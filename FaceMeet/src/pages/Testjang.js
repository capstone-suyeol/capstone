import React, { useEffect } from 'react';
import Layout from '../components/Layout';
import '../components/Testjang.css';

import { useNavigate } from 'react-router';
import { Box } from '@mui/material';

// axios를 가져옵니다.
import axios from 'axios';

function MyComponent() {
  // navigate 함수를 가져옵니다.
  const navigate = useNavigate();

  // 컴포넌트가 마운트된 후에 한 번만 실행되는 useEffect 훅을 사용합니다.
  useEffect(() => {
    // fetchData 함수 내에서 데이터를 가져오고 처리합니다.
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/data/');
        console.log(response.data);
        // 여기서 받아온 데이터를 원하는 대로 처리합니다.
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // fetchData 함수를 호출하여 데이터를 가져옵니다.
    fetchData();
  }, []); // useEffect를 빈 배열로 전달하여 컴포넌트가 마운트될 때 한 번만 실행되도록 합니다.

  return (
    <Layout>
      {/* 컴포넌트의 나머지 부분 */}
    </Layout>
  );
}

export default MyComponent;