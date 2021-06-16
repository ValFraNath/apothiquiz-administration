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
  		<BrowserRouter basename={process.env.PUBLIC_URL}>
  		<TopBar />
  			<Switch>
    			<Route exact path="/" component={Login}/>
    			<ProtectedRoute
            path="/menu"
            exact
            onlyAdmin
            component={() => (
            <Menu user={user} />
            )}
            />
          <ProtectedRoute path="/user" onlyAdmin component={User}/>
          <ProtectedRoute path="/property" onlyAdmin component={Property}/>
          <ProtectedRoute path="/system" onlyAdmin component={System}/>
          <ProtectedRoute path="/class" onlyAdmin component={Class}/>
          <ProtectedRoute path="/keepClass" onlyAdmin component={KeepClass}/>
          <ProtectedRoute path="/molecule" onlyAdmin component={Molecule}/>
          <ProtectedRoute path="/editMolecule" onlyAdmin component={EditMolecule}/>
          <ProtectedRoute path="/keepProperty" onlyAdmin component={KeepProperty}/>
  		  </Switch>
  		</BrowserRouter>
    </QueryClientProvider>
	);
}
}
