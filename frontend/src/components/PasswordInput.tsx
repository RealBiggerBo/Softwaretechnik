import { useState } from "react";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

interface Props {
  label: string;
  id: string;
  value: string;
  onValueChange: (value: string) => void;
}

function PasswordInput({ label, id, value, onValueChange }: Props) {
  const [showPswd, setShowPswd] = useState(false);
  // const [value, setValue] = useState({ password: "", showPassword: false });

  return (
    <>
      <label htmlFor={id}>{label}</label>
      <Input
        id={id}
        className="passwordInput"
        type={showPswd ? "text" : "password"}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        //  onChange={(e) => setValue({ ...value, password: e.target.value })}
        placeholder={label}
        endAdornment={
          <InputAdornment position="end">
            <IconButton onClick={() => setShowPswd(!showPswd)}>
              {showPswd ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
      />
    </>
  );
}

export default PasswordInput;
