import type { Component } from 'solid-js';
import Home from './pages/Home'

import logo from './logo.png';
import styles from './App.module.css';
import { Route, Routes } from '@solidjs/router';

const App: Component = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="*" element={<div><p>404 Error</p></div>}/>
      </Routes>
    </div>
  );
};

export default App;
