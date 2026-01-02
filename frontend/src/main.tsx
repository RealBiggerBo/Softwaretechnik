import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/de";
import App from "./App.tsx";
import "./index.css";
import { MockApiCaller } from "./classes/IApiCaller";
import { ApiCaller } from "./classes/ApiCaller.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
      <BrowserRouter>
        <App caller={new MockApiCaller()} />
      </BrowserRouter>
    </LocalizationProvider>
  </StrictMode>,
);
