import { Button } from "@mui/material";
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
      <br></br>
      <Button onClick={handleAdd}>{addText}</Button>
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
    (updater: (prev: UiItem<UiQuery>) => UiItem<UiQuery>) => {
      updateQueryById(query.id, updater);
    },
    [query.id, updateQueryById],
  );

  const handleRemove = useCallback(() => {
    removeQueryById(query.id);
  }, [query.id, removeQueryById]);

  return (
    <div>
      <QueryDisplay query={query} format={format} setQuery={handleChange} />
      <Button onClick={handleRemove}>{removeText}</Button>
    </div>
  );
});

export default memo(QueryList);
