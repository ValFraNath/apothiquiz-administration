import { DataGrid, GridToolbarContainer, GridFilterToolbarButton, GridToolbarExport, GridDensitySelector } from "@material-ui/data-grid";
import React, {useState, useRef } from "react";
import { useQuery, useQueryClient } from "react-query";

import FloatingError from "../components/status/FloatingError";
import Syst from "../utils/querySystems";


const System = (props) => {

  const queryClient = useQueryClient();
  const { data: systems, isLoading } = useQuery(["chemicals", "allSystems"]);
  const [selectedID, setSelectedID] = useState('null');
  const [selectedName, setSelectedName] = useState('null');
  const [name, setName] = useState(null);
  const [higher, setHigher] = useState(null);
  const [addError, setAddError] = useState(null);
  const [gridError, setGridError] = useState(null);
  const nameInput = useRef();

  if(isLoading)
    return <></>;

  const columns = [
    { field: 'id', headerName: 'ID', width: 200},
    { field: 'sy_name', headerName: 'Nom', flex:'1', editable:true},
    { field: 'sy_higher', headerName: 'Parent', width:220 },
  ];

/** Keep systems with level 1 */
  let higherSystems=['Aucun'];
  systems.forEach(parent=>{
    if(parent.sy_higher===null)
      higherSystems.push(parent.sy_name);
  });

/** Keep ID corresponding at the system name*/
  const searchHigherNameByID = (nameHigher) => {
    systems.forEach(element => {
      if(element.sy_name===nameHigher)
        setHigher(element.id);
    })
    if(higher === 'Aucun')
      setHigher(null);
  };

  /** Check validaty of the adding system
  */
  const checkAddSystem = () => {
    let apply = true;
    if(name===null || name===''){
      setAddError('⚠️ Merci de renseigner un nom de système');
      return false;
    }
    systems.forEach(element => {
      if(element.sy_name===name){
        setAddError('⚠️ Système existant');
        apply = false;
      }
    })
    if(apply){
      Syst.addSystem(name,higher);
    }
    setName(nameInput.current.value="");
    addError!==null && setAddError(null);
    gridError!=null && setGridError(null);
    return apply;
  };

  const checkDeleteSystem = async () => {
    let apply = true;
    systems.forEach(element=>{
      if(element.sy_higher === selectedName){
        apply = false;
      }
    })
    if(apply)
      apply = await Syst.deleteSystem(selectedID);
    return apply;
  };

/** Check validaty of updates*/
  const checkUpdateSystem = (name) => {
    let apply = true;
    if(name.split('|--')[1]!==undefined){
      name = name.split('|--')[1].trim();
    }
    if(name===""){
      setGridError('⚠️ Merci de renseigner un nom de système');
      return false;
    }
    systems.forEach(element =>{
      if(element.sy_name===name&& selectedName!==name){
        setGridError('⚠️ Votre modification ne sera pas prise en compte car ce système est déjà existant');
        apply = false;
      }
    })
    if (apply)
      Syst.updateSystem(selectedID,name);
    return apply;
  };

  const CustomToolbar = () => {
    return (
      <GridToolbarContainer>
        <GridFilterToolbarButton />
        <GridDensitySelector/>
        <GridToolbarExport/>
        {selectedID !== 'null' &&
          <button id="delete" className="MuiButtonBase-root MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-textSizeSmall MuiButton-sizeSmall" onClick={async()=> await checkDeleteSystem() ? queryClient.invalidateQueries('chemicals') : setGridError(' ⚠️ Vous ne pouvez pas supprimer ce système car il réfère au moins une molécule ou un autre système')}>Supprimer</button>
        }
      </GridToolbarContainer>
    );
  };

  return (
    <div id="flex">
      <h1> Gestion des systèmes </h1>
      <div id="grid">
        <DataGrid
          hideFooterSelectedRowCount={true}
          density='compact'
          rows={systems}
          columns={columns}
          components={{Toolbar: CustomToolbar}}
          onRowSelected={(e)=>((setSelectedID(e.data.id),setSelectedName(e.data.sy_name),setGridError(null),setAddError(null)))}
          onEditCellChangeCommitted={(e)=>checkUpdateSystem(e.props.value.trim()) && queryClient.invalidateQueries('chemicals')}
        />
      </div>
      {gridError!==null && <FloatingError message={gridError}/>}

      <h2> Ajouter un système </h2>
      <label>Nom</label>
      <input type="text" id="name" ref={nameInput} placeholder="Nom" onChange={(e)=>setName(e.target.value.trim())}required />
      <label>Système parent</label>
      <select defaultValue='null' onChange={(e)=>searchHigherNameByID(e.target.value)}>
      {higherSystems.map((value, key)=>(
        <option key={value} value={value}> {value} </option>
      ))}
      </select>
      <button id="valider" onClick={()=>checkAddSystem() && queryClient.invalidateQueries('chemicals')}> Valider </button>
      {addError!==null && <FloatingError message={addError}/>}
    </div>
  );
};

export default System;
