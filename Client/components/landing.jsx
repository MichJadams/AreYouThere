import React, { Component } from 'react';
import { render, Link } from 'react-router-dom';
// import style from '../assests/styes/landing.css';
import lobby from './lobby.jsx'
export default class Landing extends Component{

  render(){
  return (<body>
    <div class="welcomeContainer">
      <div class="welcomeText">
        <h1 >who are you there?</h1>
      </div>
      <form method="POST" action="/" >
        <label for="name"></label>
        <input type="text" name="name" class="nameForm"/>
        <div>
        <Link to={"/lobby"}><button>join lobby</button></Link>
        </div>
      </form>
    </div>
  </body>)
  }
}
