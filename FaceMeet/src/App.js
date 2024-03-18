import React, {  lazy } from 'react';
import './App.css';
import Feed from '../src/components/Feed';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';

const Home = lazy(() => import('./pages/MeetingBefore'));
const Login = lazy(() => import('./pages/Login'));
const Join = lazy(() => import('./pages/Join'));
const MeetingDetail = lazy(() => import('./pages/MeetingDetail'));
const NoteList = lazy(() => import('./pages/NoteList'));
const NoteDetail = lazy(() => import('./pages/NoteDetail'));


function App() {

  return (

      <Router>
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path='/' element={<Home />} />
          <Route path='/Login' element={<Login />} />
          <Route path='/Join' element={<Join />} />
          <Route path='/NoteList' element={<NoteList />} /> {/* db 연동 할 땐 NoteList/:_id로 변경해야함*/}
          <Route path='/MeetingDetail' element={<MeetingDetail />} /> {/* db 연동 할 땐 MeetingDetail/:_id로 변경해야함*/}
          <Route path='/NoteDetail' element={<NoteDetail />} />{/* db 연동 할 땐 NoteDetail/:_id로 변경해야함*/}
        </Routes>
      </Router>

  );
}

export default App;

