import React, { Suspense, lazy } from 'react';
import './App.css';
import Feed from '../src/components/Feed';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';

const Home = lazy(() => import('./pages/MeetingBefore'));
const Login = lazy(() => import('./pages/Login'));
const Join = lazy(() => import('./pages/Join'));
const MeetingDetail = lazy(() => import('./pages/MeetingDetail'));
const NoteDetail = lazy(() => import('./pages/NoteDetail'));

function App() {
  return (
    <Suspense fallback={<Feed />}>
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/Login' element={<Login />} />
          <Route path='/Join' element={<Join />} />
          <Route path='/MeetingDetail/:_id' element={<MeetingDetail />} />
          <Route path='/NoteDetail/:_id' element={<NoteDetail />} />
        </Routes>
      </Router>
    </Suspense>
  );
}

export default App;

