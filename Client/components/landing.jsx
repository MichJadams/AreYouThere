import React, { Component } from 'react';
import ReactDom from 'react-dom'
import { render, Link } from 'react-router-dom';
import lobby from './lobby.jsx'

export default class Landing extends Component{

  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    console.log("this state is", this.state)
    event.preventDefault();
  }

  render(){
  return (<body>
    <div className="welcomeContainer">
      <div className="welcomeText">
        <h1>who are you there?</h1>
      </div>
            <form onSubmit={this.handleSubmit}>
              <label>
                Name:
                <input type="text" value={this.state.value} onChange={this.handleChange} />
              </label>
              </form>
              <Link to={"/lobby"} params={{userName:this.state.value}}>link</Link>
        <div>
        </div>
    </div>
  </body>)
  }
}
