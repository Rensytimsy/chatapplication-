import { useState, useEffect, useContext } from 'react'
import axios from "axios";
import io from "socket.io-client";
import {Routes, Router, Route, Link} from "react-router-dom"
import LoginPage from './loginpage.jsx';
import { AuthContext } from './utils/useContext';
import HomePage from './home.jsx';
import "./index.css"

function App() {

  const {user} = useContext(AuthContext);
  console.log(user);
  return (
    <>
    <nav className='flex flex-row ml-10'>
      <li className='list-none mr-4'><Link to="/login">login</Link></li>
      <li className='list-none mr-4'><Link to="/">home</Link></li>
    </nav>
      <Routes>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path='/' element={<HomePage />}></Route>
      </Routes>
    </>
  );
}


export default App;
