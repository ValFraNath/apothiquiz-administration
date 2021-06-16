import { DataGrid, GridToolbarContainer, GridFilterToolbarButton, GridDensitySelector } from "@material-ui/data-grid";
import { PropTypes } from 'prop-types';
import React, {useState } from "react";
import { useQuery } from "react-query";
import { Link, Redirect } from "react-router-dom";

const KeepProperty = (props) => {

  const { data: properties, isLoading } = useQuery(["chemicals", "property"]);

  const [selectedID, setSelectedID] = useState('null');
  const [url, setUrl] = useState('null');
  const [selectionData, setSelectionData] = useState([]);
  const [selectionNames, setSelectionNames] = useState([]);

  props.location.state!==undefined && url==='null' && setUrl(props.location.state.url);

  if(isLoading)
    return <></>;

  const columns = [
    { field: 'id', headerName: 'ID', width: 150},
    { field: 'pv_name', headerName: 'Nom', flex:'1'},
    { field: 'pr_name', headerName: 'Propriété', width:300},
  ];

  const updateSelection = (e) => {
    const selections = e.selectionModel;
    setSelectionData(selections);
    let propertyNames = [];
    properties.forEach(property=>{
      selections.forEach(selection=>{
        if(property.id === selection){
          propertyNames.push(property.pv_name);
        }
      });
    });
    setSelectionNames(propertyNames);
  }

  const CustomToolbar = () => {
    return (
      <GridToolbarContainer>
        <GridFilterToolbarButton />
        <GridDensitySelector/>
      </GridToolbarContainer>
    );
  }

  return (
    <div id="flex">
      <h2> Sélectionnez une ou plusieurs propriétés ci-dessous </h2>
      <div id="grid">
        <DataGrid
          hideFooterSelectedRowCount={true}
          density='compact'
          rows={properties}
          columns={columns}
          components={{Toolbar: CustomToolbar}}
          onRowSelected={(e)=>((setSelectedID(e.data.id)))}
          onSelectionModelChange={(e)=>updateSelection(e)}
          checkboxSelection
         />
      </div>
      {props.location.state===undefined
      ? <Redirect to='./menu'/>
      : <Link to={{pathname:url,state: {id: {selectedID}, property: {selectionNames}, idProperty: {selectionData}}}}><button id="valider">Valider</button></Link>

      }
    </div>
  );
};

KeepProperty.propTypes = {
  location: PropTypes.object
}

export default KeepProperty;
