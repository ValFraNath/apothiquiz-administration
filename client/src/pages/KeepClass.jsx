import { DataGrid, GridToolbarContainer, GridFilterToolbarButton, GridDensitySelector } from "@material-ui/data-grid";
import { PropTypes } from 'prop-types';
import React, {useState } from "react";
import { useQuery } from "react-query";
import { Link, Redirect } from "react-router-dom";

const KeepClass = (props) => {

  const { data: classes, isLoading } = useQuery(["chemicals", "allClasses"]);

  const [selectedID, setSelectedID] = useState('null');
  const [selectedName, setSelectedName] = useState('null');

  if(isLoading)
    return <></>;

/** Keep classes with level 1 and 2
*/
  let higherClasses=[];
    classes.forEach(parent=>{
      if(parent.cl_level!==3)
        higherClasses.push(parent);
    });

  const columns = [
    { field: 'id', headerName: 'ID', width: 150},
    { field: 'cl_name', headerName: 'Nom', flex:'1'},
    { field: 'cl_higher', headerName: 'Parent', width:300},
  ];

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
      <h2> Sélectionnez une classe ci-dessous </h2>
      <div id="grid">
        <DataGrid
          hideFooterSelectedRowCount={true}
          density='compact'
          rows={higherClasses}
          columns={columns}
          components={{Toolbar: CustomToolbar}}
          onRowSelected={(e)=>((setSelectedID(e.data.id),setSelectedName(e.data.cl_name)))}
         />
      </div>
      {props.location.state===undefined
      ? <Redirect to='./menu'/>
      : <Link to={{pathname:'./class',state: {id: {selectedID}, name: props.location.state.value.name, class: {selectedName}}}}><button id="valider">Valider</button></Link>
      }
    </div>
  );
};

KeepClass.propTypes = {
  location: PropTypes.object
}

export default KeepClass;
