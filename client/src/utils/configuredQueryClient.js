import { QueryClient } from "react-query";

import { getAllClasses } from "./queryClasses";
import { getAllMolecules } from "./queryMolecules";
import { getChemicalProperty } from "./queryProperties";
import { getChemicalSystems, getAllChemicalSystems } from "./querySystems"
import { getChallengeableUsers, makeGetUserInfo, getUsers } from "./queryUsers";

const queryClient = new QueryClient();

queryClient.setDefaultOptions({
  queries: {
    cacheTime: 1000 * 60 * 10, // Keep informations in cache for ten minutes
  },
});

// Here we define the defaults functions for general queries

queryClient.setQueryDefaults(["user", "me"], {
  queryFn: makeGetUserInfo("me"),
  staleTime: Infinity,
  placeholderData: {
    avatar: {
      eyes: 0,
      hands: 0,
      hat: 0,
      mouth: 0,
      colorBody: "#000000", // black
      colorBG: "#D3D3D3", // lightgray
    },
    defeats: "-",
    pseudo: "Pseudonyme",
    victories: "-",
  },
});


queryClient.setQueryDefaults(["users", "challengeable"], {
  queryFn: getChallengeableUsers,
  staleTime: 60 * 1000,
  refetchOnMount: "always",
});

queryClient.setQueryDefaults(["chemicals", "systems"], {
  queryFn: getChemicalSystems,
  staleTime: 60 * 1000,
});

queryClient.setQueryDefaults(["chemicals", "property"], {
  queryFn: getChemicalProperty,
  staleTime: Infinity,
});

queryClient.setQueryDefaults(["users", "all"], {
  queryFn: getUsers,
  staleTime: Infinity,
});

queryClient.setQueryDefaults(["chemicals", "allSystems"], {
  queryFn: getAllChemicalSystems,
  staleTime: Infinity,
});

queryClient.setQueryDefaults(["chemicals", "allClasses"], {
  queryFn: getAllClasses,
  staleTime: Infinity,
});

queryClient.setQueryDefaults(["chemicals", "allMolecules"], {
  queryFn: getAllMolecules,
  staleTime: Infinity,
});

export default queryClient;
