import {
  Button,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Fab,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import { memo, useCallback } from "react";
import type { DataRecord } from "../classes/DataRecord";
import type { UiItem, UiQuery } from "../classes/UiItems";
import QueryDisplay from "./QueryDisplay";

interface Props {
  queries: UiItem<UiQuery>[];
  format: DataRecord;
  addText: string;
  removeText: string;
  updateQueryById: (
    queryId: string,
    updater: (prev: UiItem<UiQuery>) => UiItem<UiQuery>,
  ) => void;
  addNewQuery: () => void;
  removeQueryById: (queryId: string) => void;
}

function QueryList({
  queries,
  format,
  addText,
  removeText,
  updateQueryById,
  addNewQuery,
  removeQueryById,
}: Props) {
  const handleAdd = useCallback(() => {
    addNewQuery();
  }, [addNewQuery]);

  return (
    <>
      {queries.map((query) => (
        <QueryRow
          key={query.id}
          query={query}
          format={format}
          removeText={removeText}
          updateQueryById={updateQueryById}
          removeQueryById={removeQueryById}
        />
      ))}
      <Button onClick={handleAdd} sx={{ mt: 2 }}>
        {addText}
      </Button>
    </>
  );
}

interface QueryRowProps {
  query: UiItem<UiQuery>;
  format: DataRecord;
  removeText: string;
  updateQueryById: (
    queryId: string,
    updater: (prev: UiItem<UiQuery>) => UiItem<UiQuery>,
  ) => void;
  removeQueryById: (queryId: string) => void;
}

const QueryRow = memo(function QueryRow({
  query,
  format,
  removeText,
  updateQueryById,
  removeQueryById,
}: QueryRowProps) {
  const handleChange = useCallback(
    (value: React.SetStateAction<UiItem<UiQuery>>) => {
      if (typeof value === "function") {
        updateQueryById(query.id, value);
      } else {
        updateQueryById(query.id, () => value);
      }
    },
    [query.id, updateQueryById],
  );

  const handleRemove = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      removeQueryById(query.id);
    },
    [query.id, removeQueryById],
  );

  const queryTitle = query.value.queryTitle || "Neue Query";

  return (
    <Paper elevation={2} sx={{ marginTop: 2, overflow: "hidden" }}>
      <Accordion
        defaultExpanded
        disableGutters
        elevation={0}
        sx={{ "&:before": { display: "none" } }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            backgroundColor: "rgba(0, 0, 0, 0.03)",
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              pr: 1,
            }}
          >
            <Typography variant="subtitle1" fontWeight="medium">
              Query: {queryTitle}
            </Typography>
            <Fab
              color="error"
              aria-label={removeText}
              onClick={handleRemove}
              size="small"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <DeleteIcon />
            </Fab>
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 2 }}>
          <QueryDisplay query={query} format={format} setQuery={handleChange} />
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
});

export default memo(QueryList);
