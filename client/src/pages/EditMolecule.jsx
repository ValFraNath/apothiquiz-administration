import { DataGrid } from "@material-ui/data-grid";
import axios from "axios";
import { PropTypes } from 'prop-types';
import React, {useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { Link,Redirect } from "react-router-dom";

import FloatingError from "../components/status/FloatingError";
import Mo from "../utils/queryMolecules";

const EditMolecule = (props) => {

  const queryClient = useQueryClient();
  const [addError, setAddError] = useState(null);
  const [redirectMol, setRedirectMol] = useState(false);

  /** Set variables with props values
  */

  const [name, setName] =  useState('');
  if(props.location.state !==undefined && name===''){
    props.location.state.molecule.newMoleculeName!==undefined
     ? setName(props.location.state.molecule.newMoleculeName)
     : setName(props.location.state.molecule.selectedData.mo_dci)
  }

    const { data: molecules } = useQuery(["chemicals", "allMolecules"]);
    const[id, setID] = useState('');
    const [difficulty, setDifficulty] = useState(0);

    const [selectedSystem, setSelectedSystem]=useState('');
    const [selectedSystemID, setSelectedSystemID] = useState('null');

    const [selectedClass, setSelectedClass]=useState('');
    const [selectedClassID, setSelectedClassID] = useState('null');

    const [selectedProp, setSelectedProp]=useState([]);
    const [selectedPropID, setSelectedPropID] = useState([]);
    const [propValue, setPropValue] = useState('');

    const [url, setUrl] = useState('null');
    const [imageFile, setImageFile] = useState([]);

  if(molecules!==undefined){
    molecules.forEach(molecule=>{
      if(id===''&&molecule.mo_dci===name){
        setID(molecule.id);
        setDifficulty(molecule.mo_difficulty);
        setSelectedSystem(molecule.sy_name);
        setSelectedClass(molecule.cl_name);
        setPropValue(molecule.pv_name);
        if(molecule.mo_image!==null)
          setUrl(molecule.mo_image);
      }
    });
  }

  const [showSystemDiv, setShowSystemDiv] = useState(false);
  const [showClassDiv, setShowClassDiv] = useState(false);
  const [showPropDiv, setShowPropDiv] = useState(false);

  const { data: systems } = useQuery(["chemicals", "allSystems"]);
  const { data: classes } = useQuery(["chemicals", "allClasses"]);
  const { data: properties } = useQuery(["chemicals", "property"]);

  /** Columns for material-ui datagrid
  */
  const columnsSystems = [
    { field: 'id', headerName: 'ID', width: 150},
    { field: 'sy_name', headerName: 'Nom', flex:'1'},
    { field: 'sy_higher', headerName: 'Parent', width:300},
  ];

  const columnsClass = [
    { field: 'id', headerName: 'ID', width: 150},
    { field: 'cl_name', headerName: 'Nom', flex:'1'},
    { field: 'cl_higher', headerName: 'Parent', width:300},
  ];

  const columnsProp = [
    { field: 'id', headerName: 'ID', width: 200},
    { field: 'pv_name', headerName: 'Nom', flex:'1', editable:true },
    { field: 'pr_name', headerName: 'Propri??t??', width:220 },
  ];

/** Change url to component <img>
*/
  const changeUrl = (e) => {
    const [file] = e.target.files;
    if (file){
      setUrl(URL.createObjectURL(file));
      setImageFile(e.target.files[0]);
    }
  };

/** Change value to show or not a datagrid with System selection
*/
  const changeShowSystemDiv = () => {
    if(showSystemDiv===false)
      setShowSystemDiv(true);
  }

/** Change value to show or not a datagrid with Class selection
  */
  const changeShowClassDiv = () => {
    if(showClassDiv===false)
      setShowClassDiv(true);
  }

/** Change value to show or not a datagrid with Property selection
  */
  const changeShowPropDiv = () => {
    if(showPropDiv===false)
      setShowPropDiv(true);
  }

/** Update all variables values
*/
  const updateNameValue = (e) => {
    setName((e.target.value).trim());
  }

  const updateDifficulty = (e) => {
    setDifficulty(parseInt(e.target.value));
  }

  const updateSystemValue = () => {
    if(showSystemDiv===true)
      setShowSystemDiv(false);
    if(selectedSystem.split('|--')[1]!==undefined)
      setSelectedSystem(selectedSystem.split('|--')[1].trim());
  }

  const updateClassValue = () => {
    if(showClassDiv===true)
      setShowClassDiv(false);
    if(selectedClass.split('|--|--')[1]!==undefined){
      setSelectedClass(selectedClass.split('|--|--')[1].trim());
      return;
    }
    if(selectedClass.split('|--')[1]!==undefined){
      setSelectedClass(selectedClass.split('|--')[1].trim());
      return;
    }
  }

  const updateSelectionProp = (e) => {
    const selections = e.selectionModel;
    setSelectedPropID(selections);
    let propertyNames = [];
    properties.forEach(property=>{
      selections.forEach(selection=>{
        if(property.id === selection){
          propertyNames.push(property.pv_name+" | ");
        }
      });
    });
    setSelectedProp(propertyNames);
  }

  const updatePropValue = () => {
    if(showPropDiv)
      setShowPropDiv(false);
    setPropValue(selectedProp);
  }

/** Check the changes and update molecule informations on db
*/
  const updateMolecule = () => {
    if(name==='' || selectedClass===''|| selectedSystem===''){
      setAddError('?????? Merci de bien remplir tous les champs (Propri??t??s/image non obligatoire)');
      return;
    }
    if(propValue===''){
      setPropValue('null');
    }
      let classID = selectedClassID;
      let systemID = selectedSystemID;
      if(classID==='null'){
        classes.forEach((element)=>{
          if(element.cl_name.split('|--')[1]!==undefined){
            element.cl_name = element.cl_name.split('|--')[1].trim();
          }
          if(element.cl_name.split('|--|--')[1]!==undefined){
            element.cl_name = element.cl_name.split('|--')[1].trim();
          }
          if(element.cl_name===selectedClass){
            classID = element.id;
          }
        })
      }
      if(systemID==='null'){
        systems.forEach((element)=>{
          if(element.sy_name.split('|--')[1]!==undefined){
            element.sy_name = element.sy_name.split('|--')[1].trim();
          }
          if(element.sy_name===selectedSystem){
            systemID = element.id;
          }
        })
      }
      if(url!=='null'){
         const data = new FormData();
         data.append('file', imageFile);
         Mo.updateImage(data);
      }

      Mo.updateMolecule(id, name, difficulty, systemID, classID, selectedPropID);
      queryClient.invalidateQueries('chemicals');
      setRedirectMol(true);
  }


  return (
    <div id="createM">
    {props.location.state===undefined&&<Redirect to='/menu'/>}
      <h1> Edition de la mol??cule {name} </h1>
      <label>Nom : </label>
      <input type="text" id="name" value={name} onChange={(e)=>updateNameValue(e)} />

      <label>Difficult?? : </label>
      <select defaultValue={difficulty} onChange={updateDifficulty}>
        <option value='0'> EASY </option>
        <option value='1'> HARD </option>
      </select>
    <label>Classe : </label>
    <input type="text" id="classe" value={selectedClass} disabled />
    <button id="choose" onClick={changeShowClassDiv}>Choisir</button>

    {showClassDiv &&
      <div id="flex">
        <div id="grid">
          <DataGrid
            hideFooterSelectedRowCount={true}
            density='compact'
            rows={classes}
            columns={columnsClass}
            onRowSelected={(e)=>((setSelectedClassID(e.data.id),setSelectedClass(e.data.cl_name)))}
           />
        </div>
        <button id="choose" onClick={updateClassValue}>Fermer</button>
      </div>
    }
    <label>Syst??me : </label>
    <input type="text" id="systeme" value={selectedSystem} disabled />
    <button id="choose" onClick={changeShowSystemDiv}>Choisir</button>

    {showSystemDiv &&
      <div id="flex">
        <div id="grid">
          <DataGrid
            hideFooter={true}
            density='compact'
            rows={systems}
            onRowSelected={(e)=>(setSelectedSystem(e.data.sy_name),setSelectedSystemID(e.data.id))}
            columns={columnsSystems}
           />
         </div>
       <button id="choose" onClick={updateSystemValue}>Fermer</button>
     </div>
   }

    <label> Propri??t??s : </label>
    <p>{propValue}</p>
    <button id="prop" onClick={changeShowPropDiv}>Ajouter</button>
    {showPropDiv &&
      <div id="flex">
        <div id="grid">
        <DataGrid
            hideFooterSelectedRowCount={true}
            density='compact'
            rows={properties}
            columns={columnsProp}
            onSelectionModelChange={(e)=>updateSelectionProp(e)}
            checkboxSelection
         />
         </div>
       <button id="choose" onClick={updatePropValue}>Fermer</button>
     </div>
   }


    <label> Image : </label>
    {url !== 'null' && <img src={url} id="formula" alt='formula'/>}
    <input type="file" id="fichier" accept=".png" onChange={(e)=>changeUrl(e)}/>

    <Link to='/molecule'><button id="cancel">Annuler</button></Link>
    <button id="ok" onClick={()=>updateMolecule()}>Valider</button>
    {addError!==null && <FloatingError message={addError}/>}
    {redirectMol && <Redirect to='/molecule'/>}

    </div>
  );
};

EditMolecule.propTypes = {
  location: PropTypes.object
}

export default EditMolecule;
