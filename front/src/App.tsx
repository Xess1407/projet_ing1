import { Component, Suspense, lazy } from 'solid-js';
import Home from './pages/Home'
import Profile from "./pages/Profile";

import logo from './logo.png';
import styles from './App.module.css';
import { Route, Routes } from '@solidjs/router';
import Connect from './pages/Connect';
import Header from './components/Header';
import Register from './pages/Register';
import Box from './components/layouts/Box';
import Team from './pages/Team';
import YourTeam from './pages/YourTeam';
import Dashboard from './pages/Dashboard';
import Redirect from './pages/Redirect';
import DataChallenges from "./pages/DataChallenges";
import { Auth, Guard } from './pages/Auth';

const App: Component = () => {
  return (
    <div>
      <Header/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/connect" element={<Connect/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/profile" element={<div><Guard/><Profile/></div>}/>
        <Route path="/team" element={<div><Guard/><Team/></div>}/>
        <Route path="/yourteam/:team_id" element={<div><Guard/><YourTeam/></div>}/>
        <Route path="/dashboard" element={<div><Guard/><Dashboard/></div>}/>
        <Route path="/redirect" element={<Redirect/>} />
        <Route path="/guard-auth" element={<Auth/>} />
        <Route path="/datachallenges" element={<DataChallenges/>} />
        <Route path="*" element={<div><p>404 Error</p></div>}/>
      </Routes>
		</div>
  );
};

export default App;
