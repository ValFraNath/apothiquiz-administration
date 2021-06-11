import axios from "axios";


/**GET*/
export async function getAllClasses(){
  let { data } = await axios.get("/api/v1/chemicals/allClasses");

  data = data.map((obj) => {
    obj['id'] = obj['cl_id'];
    delete obj['sy_id'];
    if(obj['cl_level']===2){
      obj['cl_name'] = "|-- "+obj['cl_name'];
    }
    if(obj['cl_level']===3){
      obj['cl_name'] = "|--|-- "+obj['cl_name'];
    }
    return obj;
  });

  let dataClassified = [];
  data.forEach(parent => {
    if(parent.cl_level===1){
      dataClassified.push(parent);
      data.forEach(child1 => {
        if(child1.cl_higher===parent.cl_id&&child1.cl_level===2){
          child1.cl_higher = parent.cl_name;
          dataClassified.push(child1);
          data.forEach(child2 =>{
            if(child2.cl_higher===child1.cl_id&&child2.cl_level===3){
              child2.cl_higher = child1.cl_name.split('|--')[1].trim();
              dataClassified.push(child2);
            }
          })
        }
      })
    }
  })

  return dataClassified;
}

export async function getMoleculesByClass(id){
  const { data } = await axios.get(`/api/v1/chemicals/MoleculesByClass/${id}`);
  return data;
}

/**POST*/
function addClass(name, higherID, level){
  axios.post('/api/v1/chemicals/addClass',{
    name,
    higherID,
    level
  })
  return true;
}

async function deleteClass(id){
  const molecules = await getMoleculesByClass(id);
  if(molecules.length!==0){
    return false;
  }
  axios
  .post('/api/v1/chemicals/deleteClass',{
    id,
  })
  return true;
}

function updateClass(id, name){
  axios.post('/api/v1/chemicals/updateClass',{
    id,
    name,
  })
  return true;
}

export default { addClass, deleteClass, updateClass };
