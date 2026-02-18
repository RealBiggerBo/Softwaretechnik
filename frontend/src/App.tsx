import {
  Routes,
  Route,
  Navigate,
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";
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
import { ThemeProvider, type Theme } from "@emotion/react";
import { createTheme } from "@mui/material";
import { purple } from "@mui/material/colors";

interface Props {
  caller: IApiCaller;
}

function GetBrightColor(url: string, search: string) {
  const searchParams = new URLSearchParams(search);

  switch (url) {
    case "/main":
    case "/login":
    case "/search":
      return "#294d9d";
    case "/statistics":
      return "#e5017c";
    case "/dataview":
      if (searchParams.has("id")) return "#e5017c40";
      return "#fd0";
    case "/settings":
      return "#bcbcbc";
  }
  return "#ff00ff";
}

function GetDimColor() {}

function GetColorTheme(url: string, search: string): Theme {
  const mainCol = GetBrightColor(url, search);

  return createTheme({
    palette: {
      primary: {
        main: mainCol,
      },
      secondary: purple,
    },
  });
}

function App({ caller }: Props) {
  interface ProtectedRouteProps {
    isAuthenticated: boolean | "unChecked";
  }
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | "unChecked">(
    "unChecked",
  );
  const [theme, setTheme] = useState(
    GetColorTheme(useLocation().pathname, useLocation().search),
  );
  const [hasDataChanges, setHasDataChanges] = useState(false);
  const [hasFormatChanges, setHasFormatChanges] = useState(false);

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
  }, [useNavigate()]);

  useEffect(() => {
    setTheme(GetColorTheme(location.pathname, location.search));
  }, [location.pathname, location.search]);

  function handleLogin() {
    setIsLoggedIn(true);
  }

  function ProtectedRoute({
    isAuthenticated = isLoggedIn,
  }: ProtectedRouteProps) {
    if (isAuthenticated == false) {
      return <Navigate to="/login" replace />;
    }

    return <Outlet />;
  }

  return (
    <div className="mainContainer">
      <ThemeProvider theme={theme}>
        <Navbar
          caller={caller}
          hasFormatChanges={hasFormatChanges}
          hasDataChanges={hasDataChanges}
          resetChangeFlags={() => {
            console.log("RESET");
            setHasDataChanges(false);
            setHasFormatChanges(false);
          }}
        />
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
                <Route
                  path="/search"
                  element={<SearchPage caller={caller} />}
                />
                <Route
                  path="/dataview"
                  element={
                    <DataviewPage
                      caller={caller}
                      setHasFormatChanges={setHasFormatChanges}
                      setHasDataChanges={setHasDataChanges}
                      hasDataChanges={hasDataChanges}
                      hasFormatChanges={hasFormatChanges}
                    />
                  }
                />
              </Route>
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Box>
        </Container>
      </ThemeProvider>

      <footer>
        <label>Hier text für den footer?</label>
      </footer>
    </div>
  );
}

export default App;
