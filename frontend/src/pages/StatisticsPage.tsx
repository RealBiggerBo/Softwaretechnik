import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import MenuItem from "@mui/material/MenuItem";

function StatisticsPage() {
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid size={6}>
          <form>
            <Stack direction="column" spacing={2}>
              <Stack spacing={2} direction="row">
                <DatePicker label="Von" />
                <DatePicker label="Bis" />
              </Stack>
              <Stack spacing={2} direction="row">
                <TextField select fullWidth label="Vorlage">
                  <MenuItem>
                    Statische Angaben zu den Fachberatungstellen Sexulaisierte
                    Gewalt
                  </MenuItem>
                  <MenuItem>Alle Statisische Angaben die Wir haben</MenuItem>
                </TextField>
                <Button variant="contained" size="large" sx={{ px: 3 }}>
                  Berechnen
                </Button>
              </Stack>
              <Stack spacing={2} direction="row">
                <TextField select fullWidth label="Format">
                  <MenuItem>CSV</MenuItem>
                </TextField>
                <Button variant="outlined" size="large" sx={{ px: 3 }}>
                  Exportieren
                </Button>
              </Stack>
            </Stack>
          </form>
        </Grid>
        <Grid size={6}>
          <h1>Statistik</h1>
        </Grid>
      </Grid>
    </Box>
  );
}
export default StatisticsPage;
