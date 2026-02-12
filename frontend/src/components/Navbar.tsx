import { AppBar, Toolbar, IconButton, Box } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import type { IApiCaller } from "../classes/IApiCaller";
import SessionTimer from "./SessionTimer";

import HomeIcon from "@mui/icons-material/Home";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";

interface Props {
  caller: IApiCaller;
}

function Navbar({ caller }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <AppBar position="static">
      <Toolbar>

        {/* Linke Seite: */}

        {/* Hilfe Button */}
        <IconButton
          color="inherit"
          onClick={() => navigate("/help")}
        >
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

        {/* Home Button */}
        <IconButton
          color="inherit"
          disabled={isLoginPage}
          onClick={() => navigate("/main")}
        >
          <HomeIcon />
        </IconButton>

        {/* Settings Button */}
        <IconButton
          color="inherit"
          disabled={isLoginPage}
          onClick={() => navigate("/settings")}
        >
          <SettingsIcon />
        </IconButton>

          </>
        )}

      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
