import axios from "axios";

import Auth from "./authentication";

/**GET*/
/**
 * Get chemicals higher systems
 *
 */
export async function getChemicalSystems() {
  const { data: result } = await axios.get("/api/v1/chemicals/systems");

  const systems = result.reduce(
    (acc, value) => {
      acc[value.sy_id] = value.sy_name;
      return acc;
    },
    { null: "Tout" }
  );
  return systems;
}

export async function getAllChemicalSystems(){
  let { data } = await axios.get("/api/v1/chemicals/allSystems");

  data = data.map((obj) => {
    obj['id'] = obj['sy_id'];
    delete obj['sy_id'];
    if(obj['sy_higher']!==null){
      obj['sy_name'] = "|-- "+obj['sy_name'];
    }
    return obj;
  });

  let dataClassified = [];
  data.forEach(parent => {
    if(parent.sy_higher===null){
      dataClassified.push(parent);
      data.forEach(child => {
        if(child.sy_higher===parent.id){
          child.sy_higher = parent.sy_name;
          dataClassified.push(child);
        }
      })
    }
  })

  return dataClassified;
}

export async function getMoleculesBySystem(id){
  const { data } = await axios.get(`/api/v1/chemicals/MoleculesBySystem/${id}`);
  return data;
}

/**POST*/
function addSystem(name, higher){
  const { accessToken } = Auth.getCurrentUser() || {};
  axios.post('/api/v1/chemicals/addSystem',{
    name,
    higher},
    {headers: {
          Authorization: `Bearer ${accessToken}`,
    }
  })
  return true;
}

async function deleteSystem(id){
  const { accessToken } = Auth.getCurrentUser() || {};
  const molecules = await getMoleculesBySystem(id);
  if(molecules.length!==0){
    return false;
  }
  axios
  .post('/api/v1/chemicals/deleteSystem',{
    id},
    {headers: {
          Authorization: `Bearer ${accessToken}`,
    }
  })
  return true;
}

function updateSystem(id, name){
  const { accessToken } = Auth.getCurrentUser() || {};
  axios.post('/api/v1/chemicals/updateSystem',{
    id,
    name},
    {headers: {
          Authorization: `Bearer ${accessToken}`,
    }
  })
  return true;
}

export default { addSystem, deleteSystem, updateSystem };
