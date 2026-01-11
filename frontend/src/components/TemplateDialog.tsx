import {
  Button,
  Card,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import { type IApiCaller } from "../classes/IApiCaller";

interface TemplateDialogProps {
  caller: IApiCaller;
  open: boolean;
  onClose: () => void;
}

function TemplateDialog({ caller, open, onClose }: TemplateDialogProps) {
  void caller;
  const presets = ["test", "test 2"];
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Vorlage Erstellen/Bearbeiten</DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <form id="template_select">
          <h5>Wähle ein Template</h5>
          <TextField select fullWidth label="Vorlage Auswählen">
            {presets.map((preset) => (
              <MenuItem key={preset} value={preset}>
                {preset}
              </MenuItem>
            ))}
            <MenuItem value="Neue Vorlage Erstellen">
              Neue Vorlage Erstellen
            </MenuItem>
          </TextField>
          <Button type="button">Erstellen/Bearbeiten</Button>
        </form>
        <Divider />
        <br />
        <form id="template_edit">
          <Stack spacing={2}>
            <TextField label="Vorlagen Name" />
            <Divider />
            <Card variant="outlined" sx={{ padding: 2 }}>
              <Stack spacing={1}>
                <TextField label="Gruppen Name" />
                <Stack spacing={1} direction="row">
                  <TextField fullWidth label="Name"></TextField>
                  <TextField fullWidth select label="Funktion">
                    <MenuItem value="Zähle">Zähle</MenuItem>
                  </TextField>
                  <TextField fullWidth select label="Wo">
                    <MenuItem value="Gäschlecht">Gäschlecht</MenuItem>
                  </TextField>
                  <TextField fullWidth select label="Gelich">
                    <MenuItem value="*">*</MenuItem>
                    <MenuItem value="Mänlich">Mänlich</MenuItem>
                    <MenuItem value="Weiblich">Weiblich</MenuItem>
                    <MenuItem value="Divese">Divese</MenuItem>
                  </TextField>
                </Stack>
                <Button type="button">Weitere Funktion Hinzufügen</Button>
              </Stack>
            </Card>
            <Button type="button">Weitere Gruppe Hinzufügen Hinzufügen</Button>
          </Stack>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default TemplateDialog;
