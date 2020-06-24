import * as React from "react";
import LineChart from "./LineChart.js";
import { Card, CardDeck, Spinner } from "react-bootstrap";
import "./App.css";
import optionsSGV from "./svg/options.svg";
import spamSVG from "./svg/spam.svg";
import graphSVG from "./svg/graph.svg";
import emailSVG from "./svg/email.svg";

export default class AdminPage extends React.Component {
  constructor(props) {
    super(props);
    console.log("mygmailAdress");
    console.log(this.props);
    this.state = {
      data: props.data,
      mygmailAdress: props.mygmailAdress,
      myToken: props.myToken,
      isError: false,
      isSuccess: false,
      errorMessage: "",
      successMessage: "",
      spinnerAnalyse: false,
      spinnerGetPublicity: false,
      spinnerGetSpam: false,
    };
  }
  componentDidUpdate() {
    console.log("componentDidUpdate");

    this.mygmailAdress = this.props.mygmailAdress;
    this.data = this.props.mygmailAdress;
    this.myToken = this.props.myToken;
  }
  componentDidMount() {
    console.log("componentDidMount");
    this.getMyGmailData();
  }

  getMyGmailData = async (e) => {
    if (e) e.preventDefault();
    try {
      this.setState({ spinnerGetPublicity: true });
      const response = await fetch(
        "/api/getMyGmailData?mygmailAdress=" + this.mygmailAdress
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
      this.setState({ spinnerGetPublicity: false });
      return body;
    } catch (error) {
      this.setState({ spinnerGetPublicity: false });
      console.log(error);
    }
  };

  gmailDataFetch = async (e) => {
    e.preventDefault();
    try {
        this.setState({ spinnerAnalyse: true });
      const response = await fetch("/api/fetchGmailData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: this.myToken }),
      });
      const body = await response.text();
      if (response.status !== 200) throw Error(body.message);
      this.setState({ responseToPost: body, spinnerAnalyse: false });
    } catch (error) {
      this.setState({ spinnerAnalyse: false });
    }
  };

  /* getMyGmailData = async (e) => {
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
  };*/

  render() {
    return (
      <div>
        <h1 className="spaceBar">
          Select an option
          <img
            src={optionsSGV}
            width="50"
            height="50"
            className="d-inline-block align-top"
            alt="React Bootstrap logo"
          />
        </h1>
        <div className="spaceBar">
          <CardDeck>
            <div className="container">
              <div className="row justify-content-md-center">
                <div className="col col-lg-4">
                  <Card>
                    <Card.Img
                      variant="top"
                      className="spaceSVG"
                      src={emailSVG}
                    />
                    <Card.Body>
                      <Card.Title>Analyse my e-mails</Card.Title>
                      <Card.Text>
                        This option gets your e-mail publicity and then it
                        analyses the senders
                      </Card.Text>
                      <button
                        onClick={this.gmailDataFetch}
                        className="btn btn-primary"
                      >
                        Analyse
                      </button>
                    </Card.Body>
                    <Card.Footer>
                      <small className="text-muted">
                        Available
                        {this.state.spinnerAnalyse ? (
                          <Spinner animation="border" variant="danger" />
                        ) : null}
                      </small>
                    </Card.Footer>
                  </Card>
                </div>
                <div className="col col-lg-4">
                  <Card>
                    <Card.Img
                      variant="top"
                      className="spaceSVG"
                      src={graphSVG}
                    />
                    <Card.Body>
                      <Card.Title>Get my publicity analysis</Card.Title>
                      <Card.Text>
                        This options displays the analysis in the graph below
                      </Card.Text>
                      <button
                        onClick={this.getMyGmailData}
                        className="btn btn-success"
                      >
                        Get
                      </button>
                    </Card.Body>
                    <Card.Footer>
                      <small className="text-muted">
                        Available
                        {this.state.spinnerGetPublicity ? (
                          <Spinner animation="border" variant="danger" />
                        ) : null}
                      </small>
                    </Card.Footer>
                  </Card>
                </div>
                <div className="col col-lg-4">
                  <Card>
                    <Card.Img
                      variant="top"
                      className="spaceSVG"
                      src={spamSVG}
                    />
                    <Card.Body>
                      <Card.Title>Get my spam analysis</Card.Title>
                      <Card.Text>
                        This options displays the analysis in the graph below
                      </Card.Text>
                      <button
                        onClick={this.insertDataFetch}
                        className="btn btn-secondary"
                        disabled
                      >
                        Submit
                      </button>
                    </Card.Body>
                    <Card.Footer>
                      <small className="text-muted">Unavailable</small>
                    </Card.Footer>
                  </Card>
                </div>
              </div>
            </div>
          </CardDeck>
        </div>

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