import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import type { IApiCaller } from "../classes/IApiCaller";
import SessionTimer from "./SessionTimer";

import HomeIcon from "@mui/icons-material/Home";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { useEffect, useState } from "react";
import StyledButton from "./Styledbutton";

interface Props {
  caller: IApiCaller;
  hasFormatChanges: boolean;
  hasDataChanges: boolean;
}

function Navbar({ caller, hasDataChanges, hasFormatChanges }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const [userName, setUserName] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [urlstring, setUrlstring] = useState("");

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

  function checkNavigate(urlstr: string) {
    const stopNavigate = hasDataChanges || hasFormatChanges;
    if (!stopNavigate) {
      if (urlstr === "/login") {
        caller.Logout();
        navigate("/login");
      }
      navigate(urlstr);
    } else {
      setOpenDialog(true);
    }
  }

  return (
    <AppBar position="static">
      <Toolbar>
        {/* Linke Seite: Home + Settings */}
        <IconButton
          color="inherit"
          disabled={isLoginPage}
          onClick={() => {
            checkNavigate("/main");
            setUrlstring("/main");
          }}
        >
          <HomeIcon />
        </IconButton>

        <IconButton
          color="inherit"
          disabled={isLoginPage}
          onClick={() => {
            checkNavigate("/settings");
            setUrlstring("/settings");
          }}
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
                checkNavigate("/login");
                setUrlstring("/login");
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
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Seite verlassen?</DialogTitle>
          <DialogContent>
            Es wurde nicht gespeichert. Möchten Sie die Seite wirklich
            verlassen?
          </DialogContent>
          <DialogActions>
            <StyledButton
              onClick={() => setOpenDialog(false)}
              text="Abbrechen"
            />
            <StyledButton
              color="error"
              onClick={() => navigate(urlstring)}
              text="Verlassen"
            />
          </DialogActions>
        </Dialog>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
