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
  const [values, setValues] = useState({ password: "", showPassword: false });

  return (
    <>
      <label htmlFor={id}>{label}</label>
      <Input
        id={id}
        className="passwordInput"
        type={values.showPassword ? "text" : "password"}
        value={values.password}
        onChange={(e) => setValues({ ...values, password: e.target.value })}
        placeholder={label}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              onClick={() =>
                setValues({ ...values, showPassword: !values.showPassword })
              }
            >
              {values.showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
      />
    </>
  );
}

export default PasswordInput;
