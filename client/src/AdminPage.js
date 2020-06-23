import * as React from "react";

export default class AdminPage extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate() {}

  componentDidMount() {}
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


  render() {
    return(
    <div>
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
        {/*<input
          type="text"
          value={this.state.post}
          onChange={(e) => this.setState({ post: e.target.value })}
        />*/}
        <button type="submit">Submit</button>
      </form>
    </div>);
  }
}