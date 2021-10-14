/* Imports */
import React, { Component, Button } from "react";
import { NavLink } from "react-router-dom";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import BurgerMenu from "react-burger-menu";

/* CSS */
import "./menu.css";

/* Routing */
import Dashboard from "../dashboard/dashboard";
import AddUsers from "../add-users/add-users"
import ViewUsers from "../view-users/view-users"
import UserHome from "../user-home/user-home"

/* MenuWrap Class */
class MenuWrap extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <div className={this.props.side}>{this.props.children}</div>;
  }
}

/* Menu Class */
export default class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMenu: "elastic",
      side: "right"
    };
  }

  componentDidMount() {
  }

  changeSide(side) {
    this.setState({ side });
  }

  getItems() {
    let items;
    items = [
      <NavLink to="/">
        <span>Home</span>
      </NavLink>,
      // <NavLink to="/add-users">
      //   <span>Add Users</span>
      // </NavLink>,
      // <NavLink to="/view-users">
      //   <span>View Users</span>
      // </NavLink>

    ];

    return items;
  }

  getMenu() {
    const Menu = BurgerMenu[this.state.currentMenu];
    const items = this.getItems();
    return (
      <Menu pageWrapId={'page-wrap'} outerContainerId={'outer-container'}>
        {items}
      </Menu>
    );
  }

  render() {
    if (localStorage.getItem("authorized") == 'false') {
      console.log("redirecting...")
      return <Redirect to="/login" />;
    } else {
      if (localStorage.getItem("user_type") == "admin") {
        return (
          <Router>
            <div id="outer-container" >
              {this.getMenu()}
              <Route path="/" component={() => <Dashboard />} />
              <Route path="/add-users" component={AddUsers} />
              <Route path="/view-users" component={ViewUsers} />
            </div>
          </Router>
        );
      }
      else {
        return (
          <Router>
            <Route path="/" component={() => <UserHome />} />
          </Router>
        )
      }
    }
  }
}
