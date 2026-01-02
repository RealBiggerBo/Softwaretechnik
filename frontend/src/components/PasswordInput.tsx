import { useState } from "react";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

interface Props {
  label: string;
  id: string;
}

function PasswordInput({ label, id }: Props) {
  const [value, setValue] = useState({ password: "", showPassword: false });

  return (
    <>
      <label htmlFor={id}>{label}</label>
      <Input
        id={id}
        className="passwordInput"
        type={value.showPassword ? "text" : "password"}
        value={value.password}
        onChange={(e) => setValue({ ...value, password: e.target.value })}
        placeholder={label}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              onClick={() =>
                setValue({ ...value, showPassword: !value.showPassword })
              }
            >
              {value.showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
      />
    </>
  );
}

export default PasswordInput;
