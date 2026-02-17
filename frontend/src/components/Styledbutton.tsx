import type { Theme } from "@emotion/react";
import { Button } from "@mui/material";
import type { SxProps } from "@mui/material";

interface Props {
  text: string;
  type?: "submit" | "button";
  size?: "large" | "medium" | "small";
  fullWidth?: boolean;
  disabled?: boolean;
  variant?: "outlined";
  sx?: SxProps<Theme>;
  color?:
    | "error"
    | "inherit"
    | "primary"
    | "secondary"
    | "success"
    | "info"
    | "warning";
  onClick?: () => void;
}

function StyledButton({
  text,
  type,
  size,
  fullWidth,
  disabled,
  variant,
  sx,
  color,
  onClick,
}: Props) {
  const btnVariant = variant ? variant : "contained";
  const borderRadius = "30px";

  return (
    <Button
      type={type}
      size={size}
      color={color}
      fullWidth={fullWidth}
      disabled={disabled}
      onClick={() => {
        if (onClick) onClick();
      }}
      variant={btnVariant}
      sx={[
        { borderRadius: borderRadius }, // default style
        ...(Array.isArray(sx) ? sx : [sx]), // merge user styles
      ]}
    >
      {text}
    </Button>
  );
}

export default StyledButton;
