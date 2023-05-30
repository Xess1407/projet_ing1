import { Component, Suspense, lazy } from 'solid-js';
import Home from './pages/Home'
import Profile from "./pages/Profile";

import logo from './logo.png';
import styles from './App.module.css';
import { Outlet, Route, Routes } from '@solidjs/router';
import Connect, { AlreadyConnect, GuardAlreadyConnect } from './pages/Connect';
import Header from './components/Header';
import Register from './pages/Register';
import Box from './components/layouts/Box';
import Team from './pages/Team';
import YourTeam from './pages/YourTeam';
import Dashboard from './pages/Dashboard';
import Redirect from './pages/Redirect';
import DataChallenges from "./pages/DataChallenges";
import { AdminAuth, Auth, CaptainGuard, Guard } from './pages/Auth';
import DataProjects from './pages/DataProject';
import Rank from './pages/Rank';
import DashboardUser from './pages/DashboardUser';
import AllDataProjects from './pages/AllDataProjects';
import DataProjectTeams from './pages/DataProjectTeam';
import DashboardChallenge from './pages/DashboardChallenge';
import Error404 from './pages/404';
import Questionnaire from './pages/Questionnaire';
import DashboardQuestionnaire from './pages/DashboardQuestionnaire';
import DashboardCorrection from './pages/DashboardCorrection';

const App: Component = () => {
  return (
    <div>
      <Header/>
      <Routes>
        <Route path="/" element={<Home/>}/>

        <Route path="/connect" element={<div><GuardAlreadyConnect/><Connect/></div>}/>
        <Route path="/register" element={<Register/>}/>

        <Route path="/yourteam/:team_id" element={<YourTeam/>}/>

        <Route path="/dashboard" element={<div><Guard/><Dashboard/></div>}>
          <Route path="/" element={<DashboardUser/>} />
          <Route path="/rank" element={<Rank/>} />
          <Route path="/challenge" element={<DashboardChallenge />} />
          <Route path="/questionnaire" element={<DashboardQuestionnaire />} />
          <Route path="/correction" element={<DashboardCorrection />} />

          <Route path="/profile" element={<Profile/>}/>
          <Route path="/team" element={<Team/>}/>
          <Route path="/questionnaire/:questionnaire_id" element={<div><CaptainGuard/><Questionnaire/></div>} />
        </Route>

        <Route path="/redirect" element={<Redirect/>} />
        <Route path="/guard-auth" element={<Auth/>} />
        <Route path="/guard-auth-admin" element={<AdminAuth/>} />
        <Route path="/guard-connected" element={<AlreadyConnect/>} />

        <Route path="/data-challenges" element={<DataChallenges/>} />

        <Route path="/data-project/:data_challenge_id" element={<DataProjects/>} />
        <Route path="/data-project" element={<AllDataProjects/>} />
        <Route path="/data-project/teams/:data_project_id" element={<DataProjectTeams/>} />
        <Route path="*" element={<Error404/>}/>
      </Routes>
		</div>
  );
};

export default App;
