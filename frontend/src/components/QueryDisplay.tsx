import type { DataRecord } from "../classes/DataRecord";
import type { Query } from "../classes/Query";
import { Button, TextField } from "@mui/material";
import DisplayActionDisplay from "./DisplayActionDisplay";
import { DisplayAction, MaxFilterAction } from "../classes/FilterOption";

interface Props {
  query: Query;
  format: DataRecord;
}

function QueryDisplay({ query, format }: Props) {
  return (
    <>
      {query.displayActions.map((action, i) => (
        <DisplayActionDisplay
          action={action}
          format={format}
        ></DisplayActionDisplay>
      ))}
      <Button
        onClick={() =>
          query.displayActions.push({ id: -1, action: new MaxFilterAction() })
        }
      >
        Add Display Action
      </Button>
      {format.DisplayDataRecord(true)}
    </>
  );
}

export default QueryDisplay;
