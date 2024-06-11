import React from 'react';
import LoginRegisterPage from './components/login-register/LoginRegisterPage'
import ProfilePage from './components/profile/ProfilePage';
import DashboardPage from './components/dashboard/DashboardPage';
import MoviesPage from './components/movies/MoviesPage';
import UsersPage from './components/users/UsersPage';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

export default function App() {

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path="/" element={<LoginRegisterPage />}></Route>
          <Route exact path="/main" element={<DashboardPage/>}></Route>
          <Route exact path="/main/profile" element={<ProfilePage/>}></Route>
          <Route exact path="/main/movies" element={<MoviesPage/>}></Route>
          <Route exact path="/main/users" element={<UsersPage/>}></Route>
        </Routes>
      </div>
    </Router >
  );
}