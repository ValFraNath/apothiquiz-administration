import { DataGrid, GridToolbarContainer, GridFilterToolbarButton, GridToolbarExport, GridDensitySelector } from "@material-ui/data-grid";
import React, {useState, useRef } from "react";
import { useQuery, useQueryClient } from "react-query";

import FloatingError from "../components/status/FloatingError";
import Pv from "../utils/queryProperties";

const Property = () => {

  const queryClient = useQueryClient();
  const { data: property, isLoading } = useQuery(["chemicals", "property"]);
  const [selectedID, setSelectedID] = useState(null);
  const [selectedName, setSelectedName] = useState('null');
  const [name, setName] = useState(null);
  const [propertyID, setPropertyID] = useState(1);
  const [addError, setAddError] = useState(null);
  const [gridError, setGridError] = useState(null);
  const nameInput = useRef();

  if(isLoading)
    return <></>;

  let propertyValues=[];
  property.forEach(element => {
    if(!propertyValues.includes(element.pr_name)){
      propertyValues.push(element.pr_name);
    }
  })

  const columns = [
    { field: 'id', headerName: 'ID', width: 200},
    { field: 'pv_name', headerName: 'Nom', flex:'1', editable:true },
    { field: 'pr_name', headerName: 'Propriété', width:220 },
  ];

  const checkAddProperty = () => {
    let apply = true;
    if(name===null || name===''){
      setAddError('⚠️ Merci de renseigner un nom de propriété');
      return false;
    }
    property.forEach(element => {
      if(element.pv_name===name && element.pr_name===propertyValues[propertyID-1]){
        setAddError('⚠️ Propriété existante');
        apply = false;
      }
    })
    if (apply)
      Pv.addProperty(name, propertyID);
    setName(nameInput.current.value="");
    addError!==null && setAddError(null);
    gridError!=null && setGridError(null);
    return apply;
  };

  const checkUpdateProperty = (name) => {
    let apply = true;
    if(name===""){
      setGridError('⚠️ Merci de renseigner un nom de propriété');
      return false;
    }
    property.forEach(element =>{
      if(element.pv_name===name&&selectedName!==name){
        setGridError('⚠️ Votre modification ne sera pas prise en compte car cette propriété est déjà existante');
        apply = false;
      }
    })
    if (apply)
      Pv.updateProperty(selectedID,name);
    return apply;
  };

  const CustomToolbar = () => {
    return (
      <GridToolbarContainer>
        <GridFilterToolbarButton />
        <GridDensitySelector/>
        <GridToolbarExport/>
        {selectedID !== null &&
          <button id="delete" className="MuiButtonBase-root MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-textSizeSmall MuiButton-sizeSmall"
          onClick={async()=>await Pv.deleteProperty(selectedID) ? queryClient.invalidateQueries('chemicals') : setGridError(' ⚠️ Vous ne pouvez pas supprimer cette propriété car elle appartient à une ou plusieurs molécule(s)')}>Supprimer</button>
        }
      </GridToolbarContainer>
    );
  };

  return (
    <div id="flex">
      <h1> Gestion des propriétés </h1>
      <div id="grid">
        <DataGrid
          hideFooterSelectedRowCount={true}
          density='compact'
          rows={property}
          columns={columns}
          onRowSelected={(e)=>((setSelectedID(e.data.id),setSelectedName(e.data.pv_name),setGridError(null),setAddError(null)))}
          components={{Toolbar: CustomToolbar}}
          onEditCellChangeCommitted={(e)=>checkUpdateProperty(e.props.value.trim()) && queryClient.invalidateQueries('chemicals')}
        />
      </div>
      {gridError!==null && <FloatingError message={gridError}/>}

      <h2> Ajouter une propriété </h2>
      <label>Nom</label>
      <input type="text" id="name" placeholder="Nom" ref={nameInput} onChange={(e)=>setName(e.target.value.trim())} required />
      <label>Propriété</label>
      <select defaultValue='null' onChange={(e)=>setPropertyID(e.target.value)}>
      {propertyValues.map((value, key)=>(
        <option key={value} value={key+1}> {value} </option>
      ))}
      </select>
      <button id="valider" onClick={()=>checkAddProperty() && queryClient.invalidateQueries('chemicals')}> Valider </button>
      {addError!==null && <FloatingError message={addError}/>}
    </div>
  );
};

export default Property;
