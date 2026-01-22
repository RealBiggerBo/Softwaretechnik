import type { DataRecord } from "../classes/DataRecord";
import { Query } from "../classes/Query";
import { Button } from "@mui/material";
import DisplayActionDisplay from "./DisplayActionDisplay";
import { MaxFilterAction } from "../classes/FilterOption";

interface Props {
  query: Query;
  format: DataRecord;
  onChange: React.Dispatch<React.SetStateAction<Query>>;
}

function QueryDisplay({ query, onChange, format }: Props) {
  return (
    <>
      {query.displayActions.map((action, i) => (
        <DisplayActionDisplay
          action={action}
          format={format}
          onChange={(newAction) =>
            onChange((q) => ({
              ...q,
              displayActions: q.displayActions.map((a, idx) =>
                idx === i
                  ? { ...a, id: newAction.id, action: newAction.action }
                  : a,
              ),
            }))
          }
        ></DisplayActionDisplay>
      ))}
      <Button
        onClick={() => {
          onChange((q) => ({
            ...q,
            displayActions: [
              ...q.displayActions,
              { id: -1, action: new MaxFilterAction() },
            ],
          }));
        }}
      >
        Add Display Action
      </Button>
    </>
  );
}

export default QueryDisplay;
