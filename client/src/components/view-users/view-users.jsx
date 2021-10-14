import React, { Component } from "react";
import Background from "../../images/bg.png"

/* Components */

var sectionStyle = {
  backgroundImage: `url(${Background})`
};



export default class ViewUsers extends Component {
  componentDidMount(){
    document.title = "User App : Add Users";
  }
  render() {
    return (
      <div className="Home" id="page-wrap" style={{ marginTop: '-20px', paddingTop: '20px' }}>
          <h2>Hi, Prabash!</h2>
          <h1>You can view users here!</h1>
      </div>
    );
  }
}
