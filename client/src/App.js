import React, { Component } from "react";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import GoogleLogin from "react-google-login";
import { GoogleLogout } from "react-google-login";

import AdminPage from "./AdminPage.js";
import AdAnalysis from "./AdAnalysis.js";
import Home from "./home.js";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import logo from "./logo.svg";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mygmailAdress: "",
      myToken: "",
      logLabel: "Log in",
      isAdmin: false,
      login: false,
    };
  }

  logout = (log) => {
    this.setState({ login: false, logLabel: "login", isAdmin: false });
  };

  loginSuccess = async (responseToken) => {
    if (!responseToken.profileObj) return;

    let isAdminBoolean = false;
    if (responseToken.profileObj.email == "cmayor.navarro@gmail.com") {
      isAdminBoolean = true;
    } else {
      isAdminBoolean = false;
    }
    this.setState({
      mygmailAdress: responseToken.profileObj.email,
      myToken: responseToken.tokenObj,
      logLabel: responseToken.profileObj.givenName,
      login: true,
      isAdmin: isAdminBoolean,
    });
    console.log("login"+this.state.login);
  };

  componentDidMount() {}

  render() {
    return (
      <div className="App">
        <Navbar bg="success" variant="dark">
          <Navbar.Brand href="#home">
            <img
              src={logo}
              width="30"
              height="30"
              className="d-inline-block align-top"
              alt="React Bootstrap logo"
            />
          </Navbar.Brand>

          <Nav className="mr-auto">
            <Nav.Link href="home">Home</Nav.Link>
            {this.state.login ? (
              <Nav.Link href="adAnalysis">Ad analysis</Nav.Link>
            ) : null}
            {this.state.isAdmin ? (
              <Nav.Link href="adminSettings">Admin Settings</Nav.Link>
            ) : null}
          </Nav>
          <div className="float-right">
            {!this.state.login ? (
              <GoogleLogin
                clientId="843739110142-765u6gbtq5ip1borpgfkkmvivc3vd3cn.apps.googleusercontent.com"
                buttonText={this.state.logLabel}
                scope="https://www.googleapis.com/auth/gmail.readonly"
                onSuccess={this.loginSuccess}
                onFailure={this.loginSuccess}

                isSignedIn={true}
                cookiePolicy={"single_host_origin"}
              />
            ) : null}

            {this.state.login ? (
              <GoogleLogout
                clientId="843739110142-765u6gbtq5ip1borpgfkkmvivc3vd3cn.apps.googleusercontent.com"
                buttonText={this.state.logLabel + " - Logout"}
                onLogoutSuccess={this.logout}
              ></GoogleLogout>
            ) : null}
          </div>
        </Navbar>
        <Router>
          <Switch>
            <Route path="/Home">
              <Home login={this.state.login} />
            </Route>
            <Route path="/adminSettings">
              {this.state.isAdmin ? <AdminPage /> : null}
            </Route>
            <Route path="/adAnalysis">
              <AdAnalysis
                mygmailAdress={this.state.mygmailAdress}
                myToken={this.state.myToken}
              />
            </Route>
            <Route path="/">
              <Home login={this.state.login} />
            </Route>
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;