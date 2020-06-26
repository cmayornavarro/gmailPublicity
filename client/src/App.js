import React, { Component } from "react";
import GoogleLogin from "react-google-login";
import { GoogleLogout } from "react-google-login";

import logo from "./logo.svg";

import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import "./App.css";

import AdminPage from "./AdminPage.js";
import AdAnalysis from "./AdAnalysis.js";
import Home from "./home.js";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Button,
  Navbar,
  Nav,
  Form,
  FormControl,
  Card,
  CardDeck,
} from "react-bootstrap";

function getData() {
  let data = [];

  data.push({
    title: "Visits",
    data: getRandomDateArray(150),
  });

  return data;
}

// Data generation
function getRandomArray(numItems) {
  // Create random array of objects
  let names = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let data = [];
  for (var i = 0; i < numItems; i++) {
    data.push({
      label: names[i],
      value: Math.round(20 + 80 * Math.random()),
    });
  }
  return data;
}

function getRandomDateArray(numItems) {
  // Create random array of objects (with date)
  let data = [];
  let baseTime = new Date("2018-05-01T00:00:00").getTime();
  let dayMs = 24 * 60 * 60 * 1000;
  for (var i = 0; i < numItems; i++) {
    data.push({
      time: new Date(baseTime + i * dayMs),
      value: Math.round(20 + 80 * Math.random()),
    });
  }
  return data;
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: getData(),
      response: "",
      post: "",
      responseToPost: "",
      mygmailAdress: "",
      myToken: "",
      isAdmin: false,
      name: "Log in",
      login:false
    };
  }

  componentDidMount() {
   
  }

  logOK = async (e) => {
    if (e) e.preventDefault();
    console.log("ok");
  };

  render() {
    const logout = (a) => {
           this.setState({login:false,name:"login",isAdmin:false });
    };
    const responseGoogle = async (responseToken) => {
     
      this.setState({ 
      mygmailAdress: responseToken.profileObj.email,
      myToken: responseToken.tokenObj,
      name: responseToken.profileObj.givenName,
      login:true
       });   

      if (responseToken.profileObj.email == "cmayor.navarro@gmail.com") {
        this.setState({ isAdmin: true });
      } else {
        this.setState({ isAdmin: false });
      }
      await this.logOK();
      console.log(this.state.mygmailAdress);
      /* const response =  fetch("/api/fetchGmailData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code: responseToken.tokenObj }),
    });  */
    };
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
           { this.state.login ? (<Nav.Link href="adAnalysis">Ad analysis</Nav.Link>):null }
            {this.state.isAdmin ? (
              <Nav.Link href="adminSettings">Admin Settings</Nav.Link>
            ) : null}
          </Nav>
          <div className="float-right">

      {!this.state.login ?(      <GoogleLogin
              clientId="843739110142-765u6gbtq5ip1borpgfkkmvivc3vd3cn.apps.googleusercontent.com"
              buttonText={this.state.name}
              scope="https://www.googleapis.com/auth/gmail.readonly"
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              isSignedIn={true}
              cookiePolicy={"single_host_origin"}
            />):null}

   {this.state.login ?(<GoogleLogout
      clientId="843739110142-765u6gbtq5ip1borpgfkkmvivc3vd3cn.apps.googleusercontent.com"
      buttonText={this.state.name+" - Logout"}
      onLogoutSuccess={logout}
    >
    </GoogleLogout> ):null}
          </div>
        </Navbar>
        <Router>
          <Switch>
            <Route path="/Home">
              <Home login={this.state.login}/>
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
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;