import axios from "axios";

import Auth from "./authentication";

/**GET*/
export async function getChemicalProperty(){
  let { data } = await axios.get("/api/v1/chemicals/property");
  data = data.map((obj) => {
    obj['id'] = obj['pv_id'];
    delete obj['pv_id'];
    return obj;
  });
  return data;
}

export async function getMoleculesByProperty(id){
  const { data } = await axios.get(`/api/v1/chemicals/MoleculesByProperty/${id}`);
  return data;
}


/**POST*/
function addProperty(name, property){
  const { accessToken } = Auth.getCurrentUser() || {};
  axios.post('/api/v1/chemicals/addProperty',{
    name,
    property},
    {headers: {
          Authorization: `Bearer ${accessToken}`,
    }
  })
  return true;
}

async function deleteProperty(id){
  const { accessToken } = Auth.getCurrentUser() || {};
  const molecules = await getMoleculesByProperty(id);
  if(molecules.length!==0){
    return false;
  }
  axios
  .post('/api/v1/chemicals/deleteProperty',{
    id},
    {headers: {
          Authorization: `Bearer ${accessToken}`,
    }
  })
  return true;
}

function updateProperty(id, name){
  const { accessToken } = Auth.getCurrentUser() || {};
  axios.post('/api/v1/chemicals/updateProperty',{
    id,
    name},
    {headers: {
          Authorization: `Bearer ${accessToken}`,
    }
  })
  return true;
}

export default { addProperty, deleteProperty, updateProperty };
