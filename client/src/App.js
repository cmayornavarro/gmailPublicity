import React, { Component } from "react";

import logo from "./logo.svg";

import "./App.css";

class App extends Component {
  state = {
    response: "",
    post: "",
    responseToPost: "",
  };

  componentDidMount() {
    this.callApi()
      .then((res) => this.setState({ response: res.express }))
      .catch((err) => console.log(err));
  }

  callApi = async () => {
    const response = await fetch("/api/searchData");
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    for(var hit of body.hits.hits){
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

  render() {
    return (
      <div className="App">
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


        <p>{this.state.responseToPost}</p>
      </div>
    );
  }
}

export default App;