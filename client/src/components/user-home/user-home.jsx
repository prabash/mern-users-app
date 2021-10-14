import React, { Component } from "react";
import Background from "../../images/bg.png"
import styled from 'styled-components'
import api from "../../api/index"
import "./user-home.css";

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: "User"
        };
    }

    componentDidMount() {
        document.title = "User App : Home";

        console.log("access-token", localStorage.getItem("access-token"));
        var current_user_id = localStorage.getItem("current-user-id");

        api.getUser(current_user_id).then(res => {
            this.setState({ firstName: res.data.data.first_name })
        })
        api.getAllUsers().then(res => {
            var users_arr = res.data.data;
            users_arr.forEach(user => {
                if (user.status == "active") {
                    user.enable_button = "false"
                }
                else {
                    user.enable_button = "true"
                }
            });
            this.setState({ users: users_arr })
            console.log(users_arr)
        })
    }

    render() {
        const { firstName, } = this.state;

        return (
            <div className="Home" id="page-wrap" style={{ marginTop: '-20px !important', paddingTop: '20px' }}>
                <div className="container-fluid">
                    <div className="row">
                        <div style={{ display: "inline-flex" }}>
                            <div style={{ height: '100%', width: "100%", justifyContent: "center", display: "flex" }}>
                                <h2>Hi, {firstName}!</h2>
                            </div>
                            <div>
                                <button className="logout-btn" onClick={() => logoutUser()}> Logout</button>
                            </div>
                        </div>
                    </div>
                    <div >
                        <p style={{ float: "left", marginLeft: "10px", marginTop: "20px", fontSize: '1.2rem' }}>This is your homepage!</p>
                    </div>
                </div>
            </div>
        );
    }
}

const logoutUser = () => {
    localStorage.setItem("current-user-id", "")
    localStorage.setItem("authorized", 'false')
    localStorage.setItem("user_type", "")
    window.location.reload(false);
}
