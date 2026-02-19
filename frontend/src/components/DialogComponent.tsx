import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import StyledButton from "./Styledbutton";

export type DialogObject = {
  isOpen: boolean;
  title: string;
  body: string;
  yes?: string;
  no: string;
  yesAction?: () => Promise<void>;
  noAction: () => Promise<void>;
};

interface Props {
  dialogObject: DialogObject;
}

function DialogComponent({ dialogObject }: Props) {
  return (
    <Dialog open={dialogObject.isOpen} onClose={dialogObject.noAction}>
      <DialogTitle>{dialogObject.title}</DialogTitle>
      <DialogContent>{dialogObject.body}</DialogContent>
      <DialogActions>
        <StyledButton onClick={dialogObject.noAction} text={dialogObject.no} />
        {dialogObject.yes && (
          <StyledButton
            color="error"
            onClick={dialogObject.yesAction}
            text={dialogObject.yes}
          />
        )}
      </DialogActions>
    </Dialog>
  );
}

export default DialogComponent;
