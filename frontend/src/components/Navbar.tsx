import { AppBar, Toolbar, IconButton, Box } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import type { IApiCaller } from "../classes/IApiCaller";
import SessionTimer from "./SessionTimer";

import HomeIcon from "@mui/icons-material/Home";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { useEffect, useState } from "react";

interface Props {
  caller: IApiCaller;
}

function Navbar({ caller }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const [userName, setUserName] = useState("");

  const openHelp = () => {
    switch (location.pathname) {
      case "/login":
        window.open("/docs/Benutzerhandbuch.pdf#nameddest=login", "_blank");
        return;
      case "/main":
        window.open(
          "/docs/Benutzerhandbuch.pdf#nameddest=hauptansicht",
          "_blank",
        );
        return;
      case "/settings":
        window.open(
          "/docs/Benutzerhandbuch.pdf#nameddest=einstellungen",
          "_blank",
        );
        return;
      case "/search":
        window.open("/docs/Benutzerhandbuch.pdf#nameddest=suche", "_blank");
        return;
      case "/statistics":
        window.open("/docs/Benutzerhandbuch.pdf#nameddest=statistik", "_blank");
        return;
      case "/dataview":
        window.open("/docs/Benutzerhandbuch.pdf#nameddest=neu", "_blank");
        return;
      default:
        window.open("/docs/Benutzerhandbuch.pdf", "_blank");
    }
  };

  useEffect(() => {
    const loadData = async () =>
      setUserName((await caller.GetCurrentUserRights()).json?.username ?? "");
    !isLoginPage ? loadData() : setUserName("");
  }, [isLoginPage]);

  return (
    <AppBar position="static">
      <Toolbar>
        {/* Linke Seite: Home + Settings */}
        <IconButton
          color="inherit"
          disabled={isLoginPage}
          onClick={() => navigate("/main")}
        >
          <HomeIcon />
        </IconButton>

        <IconButton
          color="inherit"
          disabled={isLoginPage}
          onClick={() => navigate("/settings")}
        >
          <SettingsIcon />
        </IconButton>

        {/* Anzeigen des aktuell angemeldeten Nutzers*/}
        <label style={{ padding: "8px" }}>{userName}</label>

        {/* Abstand */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Rechte Seite */}
        {!isLoginPage && (
          <>
            {/* Session Timer */}
            <Box sx={{ mr: 2 }}>
              <SessionTimer
                timeoutSeconds={600}
                onTimeout={() => {
                  caller.Logout();
                  navigate("/login");
                }}
              />
            </Box>

            {/* Hilfe */}
            <IconButton color="inherit" onClick={openHelp}>
              <HelpOutlineIcon />
            </IconButton>

            {/* Logout */}
            <IconButton
              color="inherit"
              onClick={() => {
                caller.Logout();
                navigate("/login");
              }}
            >
              <LogoutIcon />
            </IconButton>
          </>
        )}

        {/* Wenn ausgeloggt: ausgegraute Icons anzeigen */}
        {isLoginPage && (
          <>
            <IconButton color="inherit" onClick={openHelp}>
              <HelpOutlineIcon />
            </IconButton>
            <IconButton color="inherit" disabled>
              <LogoutIcon />
            </IconButton>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
