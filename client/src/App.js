import React, { Component } from "react";
import GoogleLogin from "react-google-login";
import { GoogleLogout } from "react-google-login";

import logo from "./logo.svg";
import LineChart from "./LineChart.js";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import Child from "./Child.js";
import AdminPage from "./AdminPage.js";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Navbar, Nav, Form, FormControl } from "react-bootstrap";

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
      name:""
    };
  }

  componentDidMount() {
    console.log("mount");
    //this.setState({ response: "test"});
    //this.setState({ post: "test2"});
    /* this.callApi()
      .then((res) => this.setState({ response: res.express }))
      .catch((err) => console.log(err));*/
  }

  callApi = async () => {
    const response = await fetch("/api/searchData");
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    for (var hit of body.hits.hits) {
      console.log(hit._source.title);
    }
    return body;
  };

  gmailDataFetch = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/fetchGmailData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code: this.state.myToken }),
    });
    const body = await response.text();

    this.setState({ responseToPost: body });
  };

  getMyGmailData = async (e) => {
    if (e) e.preventDefault();
    try {
      const response = await fetch(
        "/api/getMyGmailData?mygmailAdress=" + this.state.mygmailAdress
      );

      const body = await response.json();

      var buckets = body.aggregations.group_by_body.buckets;
      let newData = [];
      let newDataPush = [];
      buckets.forEach((bucket) =>
        newData.push({ count: bucket.key, company: bucket.doc_count })
      );

      newDataPush.push({ title: "My adds", data: newData });
      this.setState({ data: newDataPush });

      if (response.status !== 200) throw Error(body.message);

      return body;
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const logout = (a) => {
      console.log(a);
    };
    const responseGoogle = async (responseToken) => {
      console.log("a");

      console.log(responseToken.profileObj); //set here in state
      this.setState({ mygmailAdress: responseToken.profileObj.email });
      this.setState({ myToken: responseToken.tokenObj });
      this.setState({ name: responseToken.profileObj.givenName });
      if(responseToken.profileObj.email== "cmayor.navarro@gmail.com"){
        this.setState({ isAdmin:true});
      }else{
        this.setState({ isAdmin:false});
      }
      await this.getMyGmailData();
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
        <Router>
          <Switch>
            <Route path="/:id?:code">
              <Child />
            </Route>
          </Switch>
        </Router>
        {/*        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>*/}

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
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#features">Add analysis</Nav.Link>
            {this.state.isAdmin ? (
              <Nav.Link href="#adminSettings">Admin Settings</Nav.Link>
            ) : null}
          </Nav>
<div class="float-right">
                    <GoogleLogin
          clientId="843739110142-765u6gbtq5ip1borpgfkkmvivc3vd3cn.apps.googleusercontent.com"
          buttonText={this.state.name}
          scope="https://www.googleapis.com/auth/gmail.readonly"
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          isSignedIn={true}
          cookiePolicy={"single_host_origin"}

        />
</div>          
        </Navbar>

        <p>{this.state.response}</p>

         {this.state.isAdmin ? ( <AdminPage />  ) : null}
        <form onSubmit={this.gmailDataFetch}>
          <p>
            <strong>Save mails in database</strong>
          </p>

          <button type="submit">Submit</button>
        </form>

        <form onSubmit={this.getMyGmailData}>
          <p>
            <strong>Get My Gmail Data</strong>
          </p>

          <button type="submit">Submit</button>
        </form>

        {/*   <GoogleLogout
          clientId="843739110142-765u6gbtq5ip1borpgfkkmvivc3vd3cn.apps.googleusercontent.com"
          buttonText="Logout"
          onLogoutSuccess={logout}
        />*/}

     

        <div>
          <LineChart
            data={this.state.data[0].data}
            title={this.state.data[0].title}
            color="#3E517A"
          />
        </div>
      </div>
    );
  }
}

export default App;