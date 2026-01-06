//import { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import SettingsPage from "./pages/SettingsPage";
import "./App.css";
import Navbar from "./components/Navbar";
//import { useState } from "react";
import type { IApiCaller } from "./classes/IApiCaller";
import StatisticsPage from "./pages/StatisticsPage";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import DataviewPage from "./pages/DataviewPage";
import SearchPage from "./pages/SearchPage";

interface Props {
  caller: IApiCaller;
}

function App({ caller }: Props) {
  return (
    <div className="mainContainer">
      <Navbar caller={caller} />
      <Container fixed>
        <Box>
          <Routes>
            <Route path="/login" element={<LoginPage caller={caller} />} />
            <Route path="/main" element={<MainPage caller={caller} />} />
            <Route
              path="/settings"
              element={<SettingsPage caller={caller} />}
            />
            <Route
              path="/statistics"
              element={<StatisticsPage caller={caller} />}
            />
            <Route path="/search" element={<SearchPage caller={caller} />} />
            <Route
              path="/dataview"
              element={<DataviewPage caller={caller} />}
            />
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
