import { DataGrid, GridToolbarContainer, GridFilterToolbarButton, GridToolbarExport, GridDensitySelector } from "@material-ui/data-grid";
import { PropTypes } from 'prop-types';
import React, {useState, useRef } from "react";
import { useQuery, useQueryClient } from "react-query";
import { Link } from "react-router-dom";

import FloatingError from "../components/status/FloatingError";
import cl from "../utils/queryClasses";


const Class = (props) => {

  const queryClient = useQueryClient();
  const { data: classes, isLoading } = useQuery(["chemicals", "allClasses"]);

  const [selectedID, setSelectedID] = useState('null');
  const [selectedName, setSelectedName] = useState('null');
  const [name, setName] = useState(null);
  const [higherName, setHigherName] = useState(null);
  const [higherID, setHigherID] = useState(null);
  const [addError, setAddError] = useState(null);
  const [gridError, setGridError] = useState(null);
  const nameInput = useRef();

  if(isLoading)
    return <></>;

/** columns for material-ui DataGrid
*/
  const columns = [
    { field: 'id', headerName: 'ID', width: 150},
    { field: 'cl_name', headerName: 'Nom', flex:'1', editable:true},
    { field: 'cl_higher', headerName: 'Parent', width:300},
  ];

/** Show new class with Parent informations
*/
  const showNewClass = () => {
    if(higherID===null){
      setName(props.location.state.name);
      setHigherID(props.location.state.id.selectedID);
      setHigherName(props.location.state.class.selectedName);
    }
    return (
      <p> - Nom de la classe : {name} / Classe parent sélectionnée : {higherName} </p>
    )
  }

/** Check validaty of the adding class
*/
  const checkAddClass = () => {
    let apply = true;
    let level = 2;

    if(name===null || name===''){
      setAddError('⚠️ Merci de renseigner un nom de classe');
      return false;
    }
    classes.forEach(element => {
      if(element.cl_name===name){
        setAddError('⚠️ Classe existante');
        apply = false;
      }
      if(element.cl_name===higherName && element.cl_higher!=null){
        level=3;
      }
    })
    if(apply){
      higherID===null ? cl.addClass(name,null,1) : cl.addClass(name,higherID,level);
    }
    setName(nameInput.current.value="");
    addError!==null && setAddError(null);
    gridError!==null && setGridError(null);
    higherID!==null && setHigherID(null);
    props.location.state = undefined;
    return apply;
  };

/** Check if the class can be delete
*/
  const checkDeleteClass = async () => {
    let apply = true;
    let nameToDelete = selectedName;
    if(selectedName.split('|--')[1]!==undefined){
      nameToDelete = selectedName.split('|--')[1].trim();
    }
    classes.forEach(element=>{
      if(element.cl_higher === nameToDelete){
        apply = false;
      }
    })
    if(apply)
      apply = await cl.deleteClass(selectedID);
    return apply;
  };

  const checkUpdateClass = (name) => {
    let apply = true;
    if(name.split('|--')[2]!==undefined){
      name = name.split('|--')[2].trim();
    }
    if(name.split('|--')[1]!==undefined){
      name = name.split('|--')[1].trim();
    }
    console.log(name);
    if(name===""){
      setGridError('⚠️ Merci de renseigner un nom de classe');
      return false;
    }
    classes.forEach(element =>{
      if(element.cl_name===name&& selectedName!==name){
        setGridError('⚠️ Votre modification ne sera pas prise en compte car cette classe est déjà existante');
        apply = false;
      }
    })
    if (apply)
      cl.updateClass(selectedID,name);
    return apply;
  };

  const CustomToolbar = () => {
    return (
      <GridToolbarContainer>
        <GridFilterToolbarButton />
        <GridDensitySelector/>
        <GridToolbarExport/>
        {selectedID !== 'null' &&
          <button id="delete" className="MuiButtonBase-root MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-textSizeSmall MuiButton-sizeSmall" onClick={async()=> await checkDeleteClass() ? queryClient.invalidateQueries('chemicals') : setGridError(' ⚠️ Vous ne pouvez pas supprimer cette classe car elle réfère au moins une molécule ou une autre classe')}>Supprimer</button>
        }
      </GridToolbarContainer>
    );
  }

  return (
    <div id="flex">
      <h1> Gestion des classes pharmacologiques </h1>
      <div id="grid">
        <DataGrid
          hideFooterSelectedRowCount={true}
          density='compact'
          rows={classes}
          columns={columns}
          components={{Toolbar: CustomToolbar}}
          onRowSelected={(e)=>((setSelectedID(e.data.id),setSelectedName(e.data.cl_name),setGridError(null),setAddError(null)))}
          onEditCellChangeCommitted={(e)=>checkUpdateClass(e.props.value.trim()) && queryClient.invalidateQueries('chemicals')}
        />
      </div>
      {gridError!==null && <FloatingError message={gridError}/>}

      <h2> Ajouter une classe </h2>
      <label>Nom</label>
      <input type="text" id="name" ref={nameInput} placeholder="Nom" onChange={(e)=>setName(e.target.value.trim())}required />
      <label>Classe parent</label>
      <Link to={{pathname:'./keepClass',state: {value:{name}}}}><button id="class">Choisir classe parent</button></Link>
      {props.location.state!==undefined && showNewClass()}
      <button id="valider" onClick={()=>checkAddClass() && queryClient.invalidateQueries('chemicals')}> Valider </button>
      {addError!==null && <FloatingError message={addError}/>}

    </div>
  );
};

Class.propTypes = {
  location: PropTypes.object
}

export default Class;
