import type { Component } from 'solid-js';
import Home from './pages/Home'

import logo from './logo.svg';
import styles from './App.module.css';
import { Route, Routes } from '@solidjs/router';
import Connect from './pages/Connect';
import Header from './components/Header';

const App: Component = () => {
  return (
    <div>
      <Header/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/connect" element={<Connect/>}/>
        <Route path="*" element={<div><p>404 Error</p></div>}/>
      </Routes>
    </div>
  );
};

export default App;
