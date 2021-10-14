import React, { Component, useState } from "react";
import Background from "../../images/bg.png";
import { Link, useHistory } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import "./login.css";
import api from "../../api/index"
import Alert from 'react-bootstrap/Alert'

/* Components */

var sectionStyle = {
    backgroundImage: `url(${Background})`
};

var message = "There was an error when logging in. Please check your username & password and try again!"

function Login() {
    const [show, setShow] = useState(false);
    let history = useHistory();

    return (
        <div id="loginFormWrapper">
            <form id="loginform" >
                <h2 id="headerTitle">Login</h2>
                <div>
                    <div class="row">
                        <input name="email" type="text" placeholder="Enter your username" onChange={onInputchange} />
                    </div>
                    <div class="row">
                        <input name="password" type="password" placeholder="Enter your password" onChange={onInputchange} />
                    </div>
                    <div id="button" className="row">
                        {/* <Link to="/" className="btn ">Login</Link> */}
                        <Button onClick={() => handleSubmit(history, setShow)} className="login-btn">Login</Button>
                    </div>
                    <Alert show={show} variant="danger">
                        <Alert.Heading>Oops!!</Alert.Heading>
                        <p>
                            {message}
                        </p>
                        <hr />
                        <div className="d-flex justify-content-end">
                            <Button onClick={() => setShow(false)} variant="outline-danger">
                                Okay
                            </Button>
                        </div>
                    </Alert>
                </div>
            </form>
        </div >
    )
}

let email = "";
let password = "";
let showAlert = false;

const onInputchange = (event) => {
    if ([event.target.name] == "email") {
        email = event.target.value;
    }
    else {
        password = event.target.value;
    }
}

const test = (setShow) => {
    setShow(true)
}

const handleSubmit = (history, setShow) => {
    var data = {
        email: email,
        password: password
    }

    api.login(data).then(res => {
        console.log(res)
        if (res.status == 200) {
            localStorage.setItem("access-token", res.data.accessToken)
            localStorage.setItem("current-user-id", res.data.id)
            localStorage.setItem("authorized", 'true')
            localStorage.setItem("user_type", res.data.type)
            history.push("/");
        }
    }).catch(error => {
        console.error("Error response:");
        message = error.response.data.message;    // ***
        console.error(error.response.status);  // ***
        console.error(error.response.headers); // ***
        localStorage.setItem("authorized", 'false')
        setShow(true)
        window.setTimeout(() => {
            setShow(false)
        }, 2000);;
    })

}

export default Login;