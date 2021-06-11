import { DataGrid, GridToolbarContainer, GridFilterToolbarButton, GridToolbarExport, GridDensitySelector } from "@material-ui/data-grid";
import React, {useState, useRef } from "react";
import { useQuery, useQueryClient } from "react-query";

import FloatingError from "../components/status/FloatingError";
import Users from "../utils/queryUsers";


const User = () => {

  const queryClient = useQueryClient();
  const { data: users, isLoading } = useQuery(["users", "all"]);

  const [selectedLogin, setSelectedLogin] = useState('null');
  const [login, setLogin] = useState('null');
  const [admin, setAdmin] = useState(0);
  const [error, setError] = useState(null);
  const loginInput = useRef();
  const adminInput = useRef();

  if(isLoading)
    return <></>;

  const columns = [
    { field: 'id', headerName: 'ID', width: 200},
    { field: 'us_login', headerName: 'Login', flex:'1'},
    { field: 'us_admin', headerName: 'Admin', type:'boolean',width:200, editable:true },
  ];

  const checkUser = () => {
    let apply = true;
    if(login==='null' || login===''){
      setError('⚠️ Merci de renseigner un pseudo.');
      return false;
    }
    users.forEach(element => {
      if(element.us_login===login){
        setError('⚠️ Utilisateur existant');
        apply = false;
      }
    })
    if (apply)
      Users.addUser(login, admin);
    setLogin(loginInput.current.value="");
    error!==null && setError(null);
    return apply;
  };

  const CustomToolbar = () => {
    return (
      <GridToolbarContainer>
        <GridFilterToolbarButton />
        <GridDensitySelector/>
        <GridToolbarExport/>
        {selectedLogin !== 'null' &&
          <button id="delete" className="MuiButtonBase-root MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-textSizeSmall MuiButton-sizeSmall" onClick={()=> Users.deleteUser(selectedLogin) && queryClient.invalidateQueries('users')}>Supprimer</button>
        }
      </GridToolbarContainer>
    );
  };

  return (
    <div id="flex">
      <h1> Gestion des utilisateurs </h1>
      <div id="grid">
        <DataGrid hideFooterSelectedRowCount={true} density='compact' rows={users} columns={columns} components={{
            Toolbar: CustomToolbar}} onRowSelected={(e)=>setSelectedLogin(e.data.us_login)} onEditCellChangeCommitted={(e)=>Users.updateUser(selectedLogin, e.props.value) && queryClient.invalidateQueries('users')}/>
      </div>
      <h2> Ajouter un utilisateur </h2>
      <label>Login</label>
      <input type="text" id="login" ref={loginInput} placeholder="Login" onChange={(e)=>setLogin(e.target.value.trim())}required />
      <label>Admin</label>
      <input type="checkbox" id="admin" ref={adminInput} onChange={(e)=>e.target.value==='on' ? setAdmin(1) : setAdmin(0)}></input>
      <button id="valider" onClick={()=>checkUser() && queryClient.invalidateQueries('users')}> Valider </button>
      {error!==null && <FloatingError message={error}/>}
    </div>
  );
};

export default User;
