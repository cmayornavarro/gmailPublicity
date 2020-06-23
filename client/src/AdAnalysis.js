import * as React from "react";
import LineChart from "./LineChart.js";
export default class AdminPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: props.state.data,
      mygmailAdress: props.state.mygmailAdress,
      myToken: props.state.myToken,
      isAdmin: props.state.isAdmin,
      name: props.state.name,
    };
  }

  componentDidMount() {
    this.getMyGmailData();
  }

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
    return (
      <div>
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