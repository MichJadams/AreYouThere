import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import style from '../assests/styes/landing.css';
export default class Landing extends Component{
  render(){

  <body>
    
    <div class="welcomeContainer">
      <div class="welcomeText">
        <h1 >who are you there?</h1>
      </div>
      <!-- <script src="js/main.js" type="module"></script> -->
      <form method="POST" action="/" >
        <label for="name"></label>
        <input type="text" name="name" class="nameForm"/>
        <div>
        <button type="submit">join lobby</button>
        </div>
      </form>
    </div>
  </body>
  }
}
