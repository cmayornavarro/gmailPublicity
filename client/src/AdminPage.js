import * as React from "react";
import {
  Button,
  Navbar,
  Nav,
  Form,
  FormControl,
  Card,
  CardDeck,
} from "react-bootstrap";
import "./App.css";
import dataSVG from "./svg/data.svg";
import mappingSVG from "./svg/mapping.svg";
import serverBaseSVG from "./svg/serverBase.svg";

export default class AdminPage extends React.Component {
  constructor(props) {
    super(props);
     this.state = {
     isError:false,
     errorMessage:"",
     successMessage:"",
     isSuccess:false

     }
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
      body: JSON.stringify({ post: "" }),
    });
    
    const body = await response.json();
   
    if(body.errorMessage){
      this.setState({ errorMessage: body.errorMessage,isError: true })
    }
    
    //const body = await response.text();
    //console.log(response);
    //var a = JSON.parse(JSON.stringify(body));
    //console.log( a.errorMessage);
    //this.setState({ responseToPost: body });
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
    const body = await response.json();
    console.log(body);
    console.log(body.acknowledged);
    if(body.errorMessage){
      this.setState({ errorMessage: body.errorMessage,isError: true,isSuccess: false })
    }else{
      this.setState({ successMessage: body.message,isSuccess: true ,isError: false })
    }
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
    return (
      <div>
        {this.state.isError ? (
      <div className="alert alert-danger" role="alert">
        {this.state.errorMessage}
      </div>
      ) : null}
        {this.state.isSuccess ? (
      <div className="alert alert-success" role="alert">
        {this.state.successMessage}
      </div>
      ) : null}        
      <div className="spaceBar">
        <CardDeck >
          <div className="container">

            <div className="row justify-content-md-center">
              <div className="col col-lg-4">
                <Card>
                            
                  <Card.Img variant="top"  className="spaceSVG" src={dataSVG}/>
                  <Card.Body>
                    <Card.Title>Create Index</Card.Title>
                    <Card.Text>
                      This functionality create an index in elasticSearch
                      database
                    </Card.Text>
                    <button
                      onClick={this.createIndexFetch}
                      className="btn btn-primary"
                    >
                      Create
                    </button>
                  </Card.Body>
                  <Card.Footer>
                    <small className="text-muted">
                      Last updated 3 mins ago
                    </small>
                  </Card.Footer>
                </Card>
              </div>
              <div className="col col-lg-4">
                <Card>
                  <Card.Img variant="top"   className="spaceSVG" src={mappingSVG}  />
                  <Card.Body>
                    <Card.Title>Add Mapping</Card.Title>
                    <Card.Text>
                      This functionality adds a mapping to the current index (in
                      elasticSearch)
                    </Card.Text>
                    <button
                      onClick={this.addMappingFetch}
                      className="btn btn-secondary"
                    >
                      Submit
                    </button>
                  </Card.Body>
                  <Card.Footer>
                    <small className="text-muted">
                      Last updated 3 mins ago
                    </small>
                  </Card.Footer>
                </Card>
              </div>
              <div className="col col-lg-4">
                <Card>
                  <Card.Img variant="top"   className="spaceSVG" src={serverBaseSVG} />
                  <Card.Body>
                    <Card.Title>Insert Data</Card.Title>
                    <Card.Text>
                      This functionality adds data in the database
                    </Card.Text>
                    <button
                      onClick={this.insertDataFetch}
                      className="btn btn-success"
                    >
                      Submit
                    </button>
                  </Card.Body>
                  <Card.Footer>
                    <small className="text-muted">
                      Last updated 3 mins ago
                    </small>
                  </Card.Footer>
                </Card>
              </div>
            </div>
          </div>
        </CardDeck>
      </div>
      </div>
    );
  }
}