//import { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import SettingsPage from "./pages/SettingsPage";
import "./App.css";
import Navbar from "./components/Navbar";
import { useState } from "react";
import type { IApiCaller } from "./classes/IApiCaller";
import StatisticsPage from "./pages/StatisticsPage";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import DataviewPage from "./pages/DataviewPage";
import SearchPage from "./pages/SearchPage";

function HomePage() {
  return (
    <div>
      <h1>Home</h1>
      <p>Willkommen auf der Startseite.</p>
    </div>
  );
}

interface Props {
  caller: IApiCaller;
}

function App({ caller }: Props) {
  return (
    <div className="mainContainer">
      <Navbar />
      <nav className="navbar">
        <Link to="/" style={{ marginRight: "1rem" }}>
          Home
        </Link>
        <Link to="/login" style={{ marginRight: "1rem" }}>
          Login
        </Link>
        <Link to="/main" style={{ marginRight: "1rem" }}>
          Hauptansicht
        </Link>
        <Link to="/settings" style={{ marginRight: "1rem" }}>
          Einstellungen
        </Link>
        <Link to="/help">Hilfe</Link>
      </nav>

      <Container fixed>
        <Box>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/main" element={<MainPage caller={caller} />} />
            <Route
              path="/settings"
              element={<SettingsPage caller={caller} />}
            />
            <Route
              path="/statistics"
              element={<StatisticsPage caller={caller} />}
            />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/dataview" element={<DataviewPage />} />
          </Routes>
        </Box>
      </Container>

      <footer>
        <label>Hier text für den footer?</label>
      </footer>
    </div>
  );
}

export default App;
