import axios from "axios";

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
  axios.post('/api/v1/chemicals/addProperty',{
    name,
    property,
  })
  return true;
}

async function deleteProperty(id){
  const molecules = await getMoleculesByProperty(id);
  if(molecules.length!==0){
    return false;
  }
  axios
  .post('/api/v1/chemicals/deleteProperty',{
    id,
  })
  return true;
}

function updateProperty(id, name){
  axios.post('/api/v1/chemicals/updateProperty',{
    id,
    name,
  })
  return true;
}

export default { addProperty, deleteProperty, updateProperty };
