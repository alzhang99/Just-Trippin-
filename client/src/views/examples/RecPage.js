import React from "react";
import { MDBDataTable } from 'mdbreact';
// reactstrap components


import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col
} from "reactstrap";

import {FormControl} from "react-bootstrap";

import IndexNavbar from "components/Navbars/IndexNavbar.js";

  export default class SearchFlightsPage extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      email: '',
      itineraryOptions: [],
      itinValue: '',
      rows: [],
      
      columns: [
        {
        'label': 'Check',
        'field': 'check'
        },
        {
        label: 'Business Name',
        field: 'name',
        sort: 'asc'
      },
      {
        label: 'Address',
        field: 'address',
        sort: 'asc'
      },
      {
        label: 'Stars',
        field: 'stars',
        sort: 'asc'
      }],
      data: []
    }
    this.submitSearch = this.submitSearch.bind(this);
    this.getItineraries = this.getItineraries.bind(this);
    this.handleChange = this.handleChange.bind(this);

  }
  
  submitSearch(e) {
    e.preventDefault();
    let city = e.target.city.value
    let state = e.target.state.value
    let stars = e.target.stars.value
    fetch("http://localhost:8082/search/" + city + "/" + state + "/" + stars,
    {
      method: "GET",
    }).then(res => {
      return res.json();
    }, err => {
      console.log("Error: " + err);
    }).then(result => {

      var resultTable = []
      for (let ind in result) {
        var elt = result[ind]
        var biz_id = elt.BUSINESS_ID
        resultTable.push({check: <Input type="checkbox" name={biz_id} value={elt.NAME}/>, name: elt.NAME, address: elt.ADDRESS, stars: elt.STARS})
      }

      this.setState({
				searchResults: resultTable
      });
      this.setState({
        data: {columns: this.state.columns, rows: resultTable}
      }) 
    });
  }

  addToItinerary(e) {
    let itinName = e.target[0].value
    let toAddList = []
    const formData = new FormData(e.target);
    e.preventDefault();
    for (var [key, value] of formData.entries()) {
      toAddList.push(key)
    }
    console.log(itinName)
    console.log(toAddList)
    fetch("http://localhost:8082/addBusToItin",
    {
      method: "POST",
      body: JSON.stringify({itin_id: itinName, list: toAddList}),
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      }
    }).then(res => {
      return res.json();
    }, err => {
      console.log("Error: " + err);
    }).then(result => {
      console.log(result)
      alert("Successfully added!")
    });
    
  }

  getItineraries(email) {
    fetch("http://localhost:8082/getCustItineraryNames/" + email,
    {
      method: "GET",
    }).then(res => {
      return res.json();
    }, err => {
      console.log("Error: " + err);
    }).then(result => {
      let resOptions = result.map((elt, i) => 
        <option value={elt.ITINERARY_ID} name={elt.ITINERARY_ID}>{elt.NAME}</option>
      );
      this.setState({
        itineraryOptions: resOptions
      }) 
    });
  }

  handleChange(event) {
    this.setState({itinValue: event.target.value});
  }

  componentWillMount(){
    let email = '';
    console.log(localStorage.getItem('email'))
    if (localStorage && localStorage.getItem('email')) {
      email = JSON.parse(localStorage.getItem('email'));
    }
    this.setState({email: email})
    this.getItineraries(email)
  }

  render() {    
    return (
      <>
      <IndexNavbar />
      <div className="page-header clear-filter" filter-color="blue">
        <div
          className="page-header-image"
          style={{
            backgroundImage: "url(" + require("assets/img/bg-search.jpg") + ")"
          }}
        ></div>
        <div className="content">
          <Container>
         
          </Container>
        </div>
      </div>
    </>
    )
  }
}