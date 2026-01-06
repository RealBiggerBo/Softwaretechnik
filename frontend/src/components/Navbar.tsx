import { AppBar, Toolbar, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { IApiCaller } from "../classes/IApiCaller";

interface Props {
  caller: IApiCaller;
}

function Navbar({ caller }: Props) {
  const navigate = useNavigate();
  return (
    <AppBar position="static">
      <Toolbar>
        {/* Linke Seite */}
        <Button color="inherit" onClick={() => navigate("/help")}>
          Hilfe
        </Button>

        {/* Abstand zwischen links und rechts */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Rechte Seite */}
        <Button
          color="inherit"
          onClick={() => {
            caller.Logout();
            navigate("/login");
          }}
        >
          Logout
        </Button>
        <Button color="inherit" onClick={() => navigate("/main")}>
          Home
        </Button>
        <Button color="inherit" onClick={() => navigate("/settings")}>
          Settings
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
