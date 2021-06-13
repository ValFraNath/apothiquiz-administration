import axios from "axios";

import Auth from "./authentication";

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
  const { accessToken } = Auth.getCurrentUser() || {};
  axios.post('/api/v1/users/add',{
    login,
    admin},
    {headers: {
          Authorization: `Bearer ${accessToken}`,
    }
  })
  return true;
}
function deleteUser(selectedLogin){
  const { accessToken } = Auth.getCurrentUser() || {};
  axios.post('/api/v1/users/delete',{
    selectedLogin},
    {headers: {
          Authorization: `Bearer ${accessToken}`,
    }
  })
  return true;
}

function updateUser(selectedLogin, newAdmin){
  const { accessToken } = Auth.getCurrentUser() || {};
  newAdmin===true ? newAdmin=1 : newAdmin=0;
  axios.post('/api/v1/users/update',{
    selectedLogin,
    newAdmin},
    {headers: {
          Authorization: `Bearer ${accessToken}`,
    }
  })
  return true;
}

export default { addUser, deleteUser, updateUser };
