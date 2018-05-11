import React, { Component } from 'react';
import ReactDom from 'react-dom'
import { render, Link } from 'react-router-dom';
import lobby from './lobby.jsx'
import axios from 'axios';

export default class Landing extends Component{

  constructor(props) {
    super(props);
    this.state = {timestamp:'no timestamp yet', value: '', nameSelected: false};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
    // console.log("this is the state", this.state)
  }

  handleSubmit(event) {
    // this.setState({nameSelected:true})
    axios.post('/name',{name: this.state.value})
    .then(()=>{
      this.props.history.push({pathname:`/lobby`})
    })
    .catch((err)=>{console.log(err)})
    event.preventDefault();
  }

  render(){
  return (
    <div className="welcomeContainer">
      <div className="welcomeText">
        <h1>who are you there?</h1>
      </div>
            <form onSubmit={this.handleSubmit}>
              <label>
                Name:
                <input type="text" value={this.state.value} onChange={this.handleChange} />
              </label>
              <button type="submit">Pick name</button>
              </form>
        <div>
        </div>
    </div>
  )
  }
}
