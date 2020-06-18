import React, { Component } from "react";
import GoogleLogin from 'react-google-login';
    import { GoogleLogout } from 'react-google-login';

import logo from "./logo.svg";
import LineChart from "./LineChart.js";
import {
 
  Switch, 
  Route,
   BrowserRouter as Router 
} from "react-router-dom";
import "./App.css";
import Child from './Child.js';

function getData() {
  let data = [];

  data.push({
    title: 'Visits',
    data: getRandomDateArray(150)
  });


  return data;
}


// Data generation
function getRandomArray(numItems) {
  // Create random array of objects
  let names = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let data = [];
  for(var i = 0; i < numItems; i++) {
    data.push({
      label: names[i],
      value: Math.round(20 + 80 * Math.random())
    });
  }
  return data;
}

function getRandomDateArray(numItems) {
  // Create random array of objects (with date)
  let data = [];
  let baseTime = new Date('2018-05-01T00:00:00').getTime();
  let dayMs = 24 * 60 * 60 * 1000;
  for(var i = 0; i < numItems; i++) {
    data.push({
      time: new Date(baseTime + i * dayMs),
      value: Math.round(20 + 80 * Math.random())
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

  createIndexFetch = async (e) => {
    // prevent to reload the page
    e.preventDefault();
    const response = await fetch("/api/createIndex", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ post: this.state.post }),
    });
    const body = await response.text();

    this.setState({ responseToPost: body });
  };

  addMappingFetch = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/addMapping", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ post: this.state.post }),
    });
    const body = await response.text();

    this.setState({ responseToPost: body });
  };

  insertDataFetch = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/insertData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ post: this.state.post }),
    });
    const body = await response.text();

    this.setState({ responseToPost: body });
  };

  gmailDataFetch = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/fetchGmailData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ post: this.state.post }),
    });
    const body = await response.text();

    this.setState({ responseToPost: body });
  };

  getGmailValidation = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/getGmailValidation");
      console.log(response);
      const body = await response.json();
      if (response.status !== 200) throw Error(body.message);
      window.location.replace(body.urlToken);
      return body;
    } catch (error) {
      console.log(error);
    }
  };

  getMyGmailData = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/getMyGmailData");
      
      const body = await response.json();

     
      var buckets = body.aggregations.group_by_body.buckets;
     let newData = [];
     let newDataPush = [];
     buckets.forEach(bucket => newData.push({
      
        data: {time:bucket.key,value:bucket.doc_count}
      }) );
  
     newDataPush.push({title:'test',data:newData});
        this.setState({data:newDataPush});
         console.log("newDataPush");
        console.log(newDataPush);
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
const responseGoogle = (responseToken) => {
  console.log("a");
 console.log(responseToken.tokenObj);
 
  /*const response =  fetch("/api/fetchGmailData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code: responseToken.tokenObj }),
    });  */
}    
    return (
      <div className="App">
      <Router>
        <Switch>
          <Route path="/:id?:code"  ><Child /></Route> 
        </Switch>
</Router>
        <header className="App-header">
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
        </header>
        <p>{this.state.response}</p>

        <form onSubmit={this.createIndexFetch}>
          <p>
            <strong>CreateIndex:</strong>
          </p>
          <button type="submit">Submit</button>
        </form>
        <form onSubmit={this.addMappingFetch}>
          <p>
            <strong>Add Mapping:</strong>
          </p>

          <button type="submit">Submit</button>
        </form>
        <form onSubmit={this.insertDataFetch}>
          <p>
            <strong>Insert Data:</strong>
          </p>
          <input
            type="text"
            value={this.state.post}
            onChange={(e) => this.setState({ post: e.target.value })}
          />
          <button type="submit">Submit</button>
        </form>
        <form onSubmit={this.gmailDataFetch}>
          <p>
            <strong>Gmail Data:</strong>
          </p>
          <input
            type="text"
            value={this.state.post}
            onChange={(e) => this.setState({ post: e.target.value })}
          />
          <button type="submit">Submit</button>
        </form>
        <form onSubmit={this.getGmailValidation}>
          <p>
            <strong>Get Gmail Validation</strong>
          </p>

          <button type="submit">Submit</button>
        </form>
        <form onSubmit={this.getMyGmailData}>
          <p>
            <strong>Get My Gmail Data</strong>
          </p>

          <button type="submit">Submit</button>
        </form>        
<GoogleLogin
    clientId="843739110142-765u6gbtq5ip1borpgfkkmvivc3vd3cn.apps.googleusercontent.com"
    buttonText="Login"
    onSuccess={responseGoogle}
    onFailure={responseGoogle}
     isSignedIn={true}
    cookiePolicy={'single_host_origin'}
  />
  <GoogleLogout
      clientId="843739110142-765u6gbtq5ip1borpgfkkmvivc3vd3cn.apps.googleusercontent.com"
      buttonText="Logout"
      onLogoutSuccess={logout}
    />
   
        <p>{this.state.responseToPost}</p>

        <div >
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