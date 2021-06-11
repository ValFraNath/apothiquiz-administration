import axios from "axios";

/** GET */
/**
 * Get a user information
 * @param {string} username The user name
 * @returns {Promise<Object>} The user information
 */
export function makeGetUserInfo(username) {
  return async () => (await axios.get(`/api/v1/users/${username}`)).data;
}

/**
 * Get challengeable users from the API
 *
 * @returns {Promise<Array>} An array with all the users that we can challenge
 */
export async function getChallengeableUsers() {
  const { data } = await axios.get("/api/v1/users/?challengeable=true");
  return data;
}

export async function getUsers(){
  let { data } = await axios.get("/api/v1/users/all");
  data = data.map((obj,i=0) => {
    obj['id'] = i++;
    return obj;
  });
  return data;
}

/** POST */
function addUser(login, admin){
  axios.post('/api/v1/users/add',{
    login,
    admin,
  })
  return true;
}
function deleteUser(selectedLogin){
  axios.post('/api/v1/users/delete',{
    selectedLogin,
  })
  return true;
}

function updateUser(selectedLogin, newAdmin){
  newAdmin===true ? newAdmin=1 : newAdmin=0;
  axios.post('/api/v1/users/update',{
    selectedLogin,
    newAdmin,
  })
  return true;
}

export default { addUser, deleteUser, updateUser };
