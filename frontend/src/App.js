import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import HomePage from './components/homePage/homePage';
import UsersPage from './components/usersPage/usersPage';
import BagsPage from './components/bagsPage/bagsPage';
import BagPage from './components/bagPage/bagPage';
import LoginPage from './components/loginPage/loginPage';
import RegistrationPage from './components/registrationPage/registrationPage';
import Footer from './components/Footer/Footer';
import './App.scss';

function App() {
  return (
    <div>
      <Navbar />
      <div id="content">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />}></Route>
            <Route path="/me" element={<UsersPage />}></Route>
            <Route path="/bags" element={<BagsPage />}></Route>
            <Route path="/bags/:id" element={<BagPage />}></Route>
            <Route path="/login" element={<LoginPage />}></Route>
            <Route path="/register" element={<RegistrationPage />}></Route>
          </Routes>
        </BrowserRouter>
      </div>
      <Footer />
    </div>
  );
}

export default App;
