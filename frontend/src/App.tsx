import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import SettingsPage from "./pages/SettingsPage";
import "./App.css";
import Navbar from "./components/Navbar";
import type { IApiCaller } from "./classes/IApiCaller";
import StatisticsPage from "./pages/StatisticsPage";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import DataviewPage from "./pages/DataviewPage";
import SearchPage from "./pages/SearchPage";
import { useEffect, useState } from "react";

interface Props {
  caller: IApiCaller;
}

function App({ caller }: Props) {
  interface ProtectedRouteProps {
    isAuthenticated: boolean;
  }
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function checkLogin() {
      try {
        const res = await caller.GetCurrentUserRights();
        if (res.success) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch {
        setIsLoggedIn(false);
      }
    }

    checkLogin();
  }, [caller]);

  function handleLogin() {
    setIsLoggedIn(true);
  }

  function ProtectedRoute({
    isAuthenticated = isLoggedIn,
  }: ProtectedRouteProps) {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    return <Outlet />;
  }

  return (
    <div className="mainContainer">
      <Navbar caller={caller} />
      <Container fixed>
        <Box>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route
              path="/login"
              element={<LoginPage caller={caller} onLogin={handleLogin} />}
            />
            <Route path="/help" element={<></>} />
            <Route element={<ProtectedRoute isAuthenticated={isLoggedIn} />}>
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
            </Route>
            <Route path="*" element={<Navigate to="/login" replace />} />
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
