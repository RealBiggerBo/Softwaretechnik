import Stack from "@mui/material/Stack";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import type { Dayjs } from "dayjs";

interface DatePickerRangeProps {
  start: Dayjs | null;
  end: Dayjs | null;
  onStartChange: (value: Dayjs | null) => void;
  onEndChange: (value: Dayjs | null) => void;
}

function DatePickerRange({
  start,
  end,
  onStartChange,
  onEndChange,
}: DatePickerRangeProps) {
  return (
    <Stack spacing={2} direction="row">
      <DatePicker
        label="Von"
        value={start}
        maxDate={end ?? undefined}
        onChange={onStartChange}
      />
      <DatePicker
        label="Bis"
        value={end}
        minDate={start ?? undefined}
        onChange={onEndChange}
      />
    </Stack>
  );
}

export default DatePickerRange;
