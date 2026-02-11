import { useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import { Button, Fab } from "@mui/material";
import type { IApiCaller } from "../classes/IApiCaller";

interface Props {
  caller: IApiCaller;
  handleCreateField: (type: string) => void;
  isEditMode: boolean;
}

function AddField({ caller, handleCreateField, isEditMode }: Props) {
    const [showFieldSelector, setShowFieldSelector] = useState(false);
    

    return(
        <div>
            <Fab color="primary" aria-label="add" size="small" style={{ float: "left" }} onClick={() => setShowFieldSelector(true)} disabled={isEditMode}>
                <AddIcon/>
            </Fab>
            {showFieldSelector && (
            <div>
                <Button onClick={() => { handleCreateField("text"); setShowFieldSelector(false); }} size="small" variant="outlined" style={{margin: "5px"}}>Text</Button>
                <Button onClick={() => { handleCreateField("date"); setShowFieldSelector(false); }} size="small" variant="outlined" style={{margin: "5px"}}>Date</Button>
                <Button onClick={() => { handleCreateField("integer"); setShowFieldSelector(false); }} size="small" variant="outlined" style={{margin: "5px"}}>Integer</Button>
                <Button onClick={() => { handleCreateField("toggle"); setShowFieldSelector(false); }} size="small" variant="outlined" style={{margin: "5px"}}>Toggle</Button>
                <br/>
            </div>
            )}
        </div>
    );
}
export default AddField;

