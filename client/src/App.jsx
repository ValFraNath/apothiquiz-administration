import React, { Component }from "react";
import { QueryClientProvider } from "react-query";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import TopBar from "./components/system/TopBar";
import "./styles/styles.scss";
import Class from "./pages/Class";
import EditMolecule from "./pages/EditMolecule";
import KeepClass from "./pages/KeepClass"
import KeepProperty from "./pages/KeepProperty"
import Login from "./pages/Login";
import Menu from "./pages/Menu";
import Molecule from "./pages/Molecule";
import Property from "./pages/Property";
import System from "./pages/System";
import User from "./pages/User";
import Auth from "./utils/authentication";
import queryClient from "./utils/configuredQueryClient";

export default class App extends Component {
  constructor(props) {
    super(props);

    let { pseudo } = Auth.getCurrentUser() || {};

    this.state = {
      user: pseudo || null,
    };
  }

render() {
	const { user } = this.state;
	return (
    <QueryClientProvider client={queryClient}>
  		<BrowserRouter>
  		<TopBar />
  			<Switch>
    			<Route exact path="/administration" component={Login}/>
    			<ProtectedRoute
            path="/administration/menu"
            exact
            onlyAdmin
            component={() => (
            <Menu user={user} />
            )}
            />
          <ProtectedRoute path="/administration/user" onlyAdmin component={User}/>
          <ProtectedRoute path="/administration/property" onlyAdmin component={Property}/>
          <ProtectedRoute path="/administration/system" onlyAdmin component={System}/>
          <ProtectedRoute path="/administration/class" onlyAdmin component={Class}/>
          <ProtectedRoute path="/administration/keepClass" onlyAdmin component={KeepClass}/>
          <ProtectedRoute path="/administration/molecule" onlyAdmin component={Molecule}/>
          <ProtectedRoute path="/administration/editMolecule" onlyAdmin component={EditMolecule}/>
          <ProtectedRoute path="/administration/keepProperty" onlyAdmin component={KeepProperty}/>
  		  </Switch>
  		</BrowserRouter>
    </QueryClientProvider>
	);
}
}
