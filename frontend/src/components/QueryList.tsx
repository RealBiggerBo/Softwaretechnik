import { Button } from "@mui/material";
import type { DataRecord } from "../classes/DataRecord";
import type { UiItem, UiQuery } from "../classes/UiItems";
import QueryDisplay from "./QueryDisplay";

interface Props {
  queries: UiItem<UiQuery>[];
  format: DataRecord;
  addText: string;
  removeText: string;
  updateQuery: (
    queryToUpdate: UiItem<UiQuery>,
    newQuery: UiItem<UiQuery>,
  ) => void;
  addNewQuery: () => void;
  removeQuery: (queryToRemove: UiItem<UiQuery>) => void;
}

function QueryList({
  queries,
  format,
  addText,
  removeText,
  updateQuery,
  addNewQuery,
  removeQuery,
}: Props) {
  return (
    <>
      {queries.map((query, _) => (
        <div key={query.id}>
          <QueryDisplay
            query={query}
            format={format}
            onChange={(newQuery) => updateQuery(query, newQuery)}
          ></QueryDisplay>
          <Button onClick={() => removeQuery(query)}>{removeText}</Button>
        </div>
      ))}
      <br></br>
      <Button onClick={() => addNewQuery()}>{addText}</Button>
    </>
  );
}

export default QueryList;
