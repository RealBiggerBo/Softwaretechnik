import type { DataRecord } from "../classes/DataRecord";
import { Query } from "../classes/Query";
import { Button } from "@mui/material";
import DisplayActionDisplay from "./DisplayActionDisplay";
import { type DisplayAction } from "../classes/FilterOption";

interface Props {
  query: Query;
  format: DataRecord;
  onChange: (query: Query) => void;
}

function UpdateDisplayAction(
  oldQuery: Query,
  actionToReplace: DisplayAction,
  newAction: DisplayAction,
): Query {
  return {
    ...oldQuery,
    displayActions: oldQuery.displayActions.map((originalAction, i) =>
      originalAction === actionToReplace ? newAction : originalAction,
    ),
  };
}

function AddDisplayAction(oldQuery: Query): Query {
  return {
    ...oldQuery,
    displayActions: [
      ...oldQuery.displayActions,
      { type: "Empty", fieldId: -1 },
    ],
  };
}

function RemoveDisplayAction(
  oldQuery: Query,
  actionToRemove: DisplayAction,
): Query {
  return {
    ...oldQuery,
    displayActions: oldQuery.displayActions.filter(
      (action) => !(action === actionToRemove),
    ),
  };
}

function QueryDisplay({ query, format, onChange }: Props) {
  return (
    <>
      {query.displayActions.map((action, i) => (
        <>
          <DisplayActionDisplay
            key={i}
            action={action}
            format={format}
            onChange={(newAction) =>
              onChange(UpdateDisplayAction(query, action, newAction))
            }
          ></DisplayActionDisplay>
          <Button onClick={() => onChange(RemoveDisplayAction(query, action))}>
            Entfernen
          </Button>
        </>
      ))}
      <Button onClick={() => onChange(AddDisplayAction(query))}>
        Neues Anzeigefeld
      </Button>
    </>
  );
}

export default QueryDisplay;
