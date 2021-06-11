import axios from "axios";

/**GET */

export async function getAllMolecules(){
  let { data } =  await axios.get("/api/v1/chemicals/allMolecules");
  data = data.map((molecule) => {
    molecule['id'] = molecule['mo_id'];
    delete molecule['mo_id'];
    if(molecule['sy_name']===null)
      molecule['sy_name']='null';
    if(molecule['cl_name']===null)
      molecule['cl_name']='null';
    if(molecule['pv_name']===null)
      molecule['pv_name']='null';
    data.map((sameMolecule) => {
      if(molecule['id']===sameMolecule['id']&&molecule!==sameMolecule&&sameMolecule['pv_name']!==undefined){
        molecule['pv_name'] += " | "+sameMolecule['pv_name'];
        delete sameMolecule['pv_name'];
      }
      return sameMolecule;
    })
    return molecule;
  });

  for (let i=0;i<data.length;i++){
    if (data[i].pv_name===undefined){
      data.splice(i,1);
      i=0;
    }
  }
  return data;
}

/**POST*/

function deleteMolecule(id){
  axios
  .post('/api/v1/chemicals/deleteMolecule',{
    id,
  })
  return true;
}

function addMolecule(name){
  axios
  .post('/api/v1/chemicals/addMolecule',{
    name,
  })
}

function updateMolecule(id,name,diff,sy,cl,pr){
  axios
  .post('/api/v1/chemicals/updateMolecule',{
    id,
    name,
    diff,
    sy,
    cl,
    pr,
  })
}

function updateImage(file){
  axios
  .post('/api/v1/import/uniqueImage',{
    file,
  })
}

export default { deleteMolecule, addMolecule, updateMolecule, updateImage };
