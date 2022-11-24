import React from "react";
import './App.css';
import {BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './Components/Home';
import Auth from "./Components/Auth";
import CreateProfile from "./Components/CreateProfile";
import ErrorPage from './Components/ErrorPage';
import MovieDetail from './Components/MovieDetail';
import Favourites from "./Components/Favourites";
import WatchList from "./Components/WatchList";
import Discussion from "./Components/Discussion";

export default function App() {
  return (
    <div className="App" style={{background: "#001e3c", minWidth: "447px"}}>
      <Router>
        <Routes>
          <Route path="/:userId" element={<Home />} />
          <Route path="/" element={<Auth />} />
          <Route path="/create-profile/:userId" element={<CreateProfile/>} />
          <Route path="/:userId/favourites" element={<Favourites/>} />
          <Route path="/:userId/watchlist" element={<WatchList /> } />
          <Route path="/movie-detail/:movieId/:userId" element={<MovieDetail/>} />
          <Route path="/discussion/:movieId/:userId" element={<Discussion /> } />
          <Route path="*" element={<ErrorPage/>} />
        </Routes>
      </Router>
    </div>
  );
};