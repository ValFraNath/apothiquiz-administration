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

  const[id, setID] = useState('');
  if(props.location.state !==undefined && id===''){
    props.location.state.id!==undefined
     ? setID(props.location.state.id.selectedID)
     : setID(props.location.state.molecule.selectedData.id)
  }

  const [name, setName] =  useState('');
  if(props.location.state !==undefined && name===''){
    props.location.state.molecule.newMoleculeName!==undefined
     ? setName(props.location.state.molecule.newMoleculeName)
     : setName(props.location.state.molecule.selectedData.mo_dci)
  }

  const [difficulty, setDifficulty] = useState(0);
  props.location.state!==undefined
   && props.location.state.molecule.selectedData!==undefined
    && props.location.state.molecule.selectedData.mo_difficulty!==difficulty
     && setDifficulty(props.location.state.molecule.selectedData.mo_difficulty);

  const [selectedSystem, setSelectedSystem]=useState('');
  const [selectedSystemID, setSelectedSystemID] = useState('null');
  selectedSystem===''
  && props.location.state!==undefined
   && props.location.state.molecule.selectedData!==undefined
    && setSelectedSystem(props.location.state.molecule.selectedData.sy_name);

  const [selectedClass, setSelectedClass]=useState('');
  const [selectedClassID, setSelectedClassID] = useState('null');
  selectedClass===''
  && props.location.state!==undefined
   && props.location.state.molecule.selectedData!==undefined
    && setSelectedClass(props.location.state.molecule.selectedData.cl_name);

  const [selectedProp, setSelectedProp]=useState([]);
  const [selectedPropID, setSelectedPropID] = useState([]);
  const [propValue, setPropValue] = useState('');
  propValue===''
  && props.location.state!==undefined
   && props.location.state.molecule.selectedData!==undefined
    && setPropValue(props.location.state.molecule.selectedData.pv_name);

  const [url, setUrl] = useState('null');
  const [imageFile, setImageFile] = useState([]);
  url==='null'
  && props.location.state!==undefined
    && props.location.state.molecule.selectedData!==undefined
     && props.location.state.molecule.selectedData.mo_image!==null
        && setUrl('api/v1/files/images/'+props.location.state.molecule.selectedData.mo_image);

  const [showSystemDiv, setShowSystemDiv] = useState(false);
  const [showClassDiv, setShowClassDiv] = useState(false);
  const [showPropDiv, setShowPropDiv] = useState(false);

  const { data: systems } = useQuery(["chemicals", "allSystems"]);
  const { data: classes } = useQuery(["chemicals", "allClasses"]);
  const { data: properties } = useQuery(["chemicals", "property"]);

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
    { field: 'pr_name', headerName: 'Propriété', width:220 },
  ];

  const changeUrl = (e) => {
    const [file] = e.target.files;
    console.log(file);
    setImageFile(e.target.files);
    if (file){
      setUrl(URL.createObjectURL(file));
    }
  };

  const changeShowSystemDiv = () => {
    if(showSystemDiv===false)
      setShowSystemDiv(true);
  }

  const changeShowClassDiv = () => {
    if(showClassDiv===false)
      setShowClassDiv(true);
  }

  const changeShowPropDiv = () => {
    if(showPropDiv===false)
      setShowPropDiv(true);
  }

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

  const updateMolecule = () => {
    if(name==='' || selectedClass==='null' || selectedClass==='' || selectedSystem==='' || selectedSystem==='null'){
      setAddError('⚠️ Merci de bien remplir tous les champs (Propriétés/image non obligatoire)');
      return;
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
      Mo.updateMolecule(id, name, difficulty, systemID, classID, selectedPropID);
      // if(url!=='null'){
      //   Mo.updateImage(imageFile);
      // }
      queryClient.invalidateQueries('chemicals');
      setRedirectMol(true);
  }


  return (
    <div id="createM">
    {props.location.state===undefined&&<Redirect to='/menu'/>}
      <h1> Edition de la molécule {name} </h1>
      <label>Nom : </label>
      <input type="text" id="name" value={name} onChange={(e)=>updateNameValue(e)} />

      <label>Difficulté : </label>
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
    <label>Système : </label>
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

    <label> Propriétés : </label>
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
