import { DataGrid, GridToolbarContainer, GridFilterToolbarButton, GridDensitySelector } from "@material-ui/data-grid";
import React, {useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { Redirect } from "react-router-dom";

import FloatingError from "../components/status/FloatingError";

import Mo from "../utils/queryMolecules";

const Molecule = () => {

  const queryClient = useQueryClient();
  const { data: molecules, isLoading } = useQuery(["chemicals", "allMolecules"]);

  const [selectedID, setSelectedID] = useState('null');
  const [selectedName, setSelectedName] = useState('null');
  const [selectedData, setSelectedData] = useState([]);

  const [newMoleculeName, setNewMoleculeName] = useState('');
  const [addError, setAddError] = useState(null);
  const [redirectAdd, setRedirectAdd] = useState(false);
  const [redirectEdit, setRedirectEdit] = useState(false);

  const [wantToDelete, setWantToDelete]= useState(false);
  const [hideCancelB, setHideCancelB]= useState(true);
  const [hideDeleteB, setHideDeleteB] = useState(true);

  if(isLoading)
    return <></>;

  const columns = [
    { field: 'id', headerName: 'ID', width: 70, hide:true},
    { field: 'mo_dci', headerName: 'Nom', width:500},
    { field: 'mo_difficulty', headerName: 'Difficulté', width:120},
    { field: 'cl_name', headerName: 'Classe', width:500},
    { field: 'sy_name', headerName: 'Système', width:220},
    { field: 'mo_image', headerName:'Image', hide:true},
    { field: 'pv_name', headerName: 'Propriétés', width:500},
  ];

/** Update value when the input changes
*/
  const updateNewMoleculeName = (e) => {
    setNewMoleculeName(e.target.value.trim());
  }

/** Redirect to edition page
*/
  const editMolecule = () => {
    setRedirectEdit(true);
  }

  const checkAddMolecule = () => {
    let apply = true;
    if(newMoleculeName===null || newMoleculeName===''){
      setAddError('⚠️ Merci de renseigner un nom de molécule');
      return false;
    }
    molecules.forEach(element => {
      if(element.mo_dci===newMoleculeName){
        setAddError('⚠️ Molécule existante');
        apply = false;
      }
    })
    if(apply){
      Mo.addMolecule(newMoleculeName);
      queryClient.invalidateQueries('chemicals');
      setRedirectAdd(true);
    }
  }

/** Update variables to show or not a message to confirm a molecule's updateSelection
*/
  const updateWantToDelete = () => {
    wantToDelete ? setWantToDelete(false) : setWantToDelete(true);
    hideCancelB ? setHideCancelB(false) : setHideCancelB(true);
    hideDeleteB ? setHideDeleteB(false) : setHideDeleteB(true);
  }

  const deleteMolecule = () => {
    Mo.deleteMolecule(selectedID);
    updateWantToDelete();
    queryClient.invalidateQueries('chemicals');
  }

  const CustomToolbar = () => {
    return (
      <GridToolbarContainer>
        <GridFilterToolbarButton />
        <GridDensitySelector/>
        {selectedID !== 'null' ? (
          <>
          <button className="MuiButtonBase-root MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-textSizeSmall MuiButton-sizeSmall" onClick={editMolecule}>Editer</button>
                    <button id="delete" className="MuiButtonBase-root MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-textSizeSmall MuiButton-sizeSmall" onClick={()=>updateWantToDelete()}>Supprimer</button>
          </>
        )
        : (<></>)
        }
      </GridToolbarContainer>
    );
  }

  return (
    <div id="flex">
      <h2> Gestion des molécules </h2>
      <div id="grid" style={{width:'75%', height:'650px'}}>
        <DataGrid hideFooterSelectedRowCount={true} density='compact' rows={molecules} columns={columns} components={{
            Toolbar: CustomToolbar}} onRowSelected={(e)=>((setSelectedID(e.data.id), setSelectedName(e.data.mo_dci), setSelectedData(e.data)))}
         />
      </div>
      {wantToDelete && <p>⚠️ Voulez-vous vraiment supprimer {selectedName} ? </p>}
      {!hideDeleteB && <button id="deleteM" onClick={()=> deleteMolecule()}style={{width:50}}>Oui</button>}
      {!hideCancelB && <button id="cancelM" onClick={()=>updateWantToDelete()} style={{width:50,margin:5}}>Non</button>}
      <h2> Ajout d'une nouvelle molécule </h2>
      <input type="text" onChange={(e)=>updateNewMoleculeName(e)} placeholder="Nom"></input>
      {addError!==null && <FloatingError message={addError}/>}
      <button id="addM" onClick={checkAddMolecule}>Ajouter molécule</button>
      {redirectAdd && <Redirect to={{pathname:'editMolecule', state:{molecule:{newMoleculeName}}}}/>}
      {redirectEdit && <Redirect to={{pathname:'editMolecule', state:{molecule:{selectedData}}}}/>}
    </div>
  );
};

export default Molecule;
