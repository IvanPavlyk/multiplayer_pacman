import React from "react";
import axios from 'axios';
import { Container, Row } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { GoogleLogin } from "react-google-login";
import "./style.css";

const Login = () => {
    const history = useHistory();

    const handleLoginSuccess = (response) => {
        const profile = response.profileObj;
        const user = {
            name: profile.name,
            email: profile.email
        }

        axios.post("http://localhost:3002/add-user", user)
        .then( res => {
            history.push("/room"); //TODO: push to create account page
        });

    };

    const handleLoginFailure = (response) => {
        console.error(response);
    };

    return (
        <Container>
            <Row className="justify-content-center">
                <GoogleLogin
                    clientId={
                        "1082753993159-va32d2tcalpqv67hnc0apngd0hsk48e0.apps.googleusercontent.com"
                    }
                    buttonText="Log in with Google"
                    onSuccess={handleLoginSuccess} //might only use one function here
                    onFailure={handleLoginFailure}
                    cookiePolicy={"single_host_origin"}
                />
            </Row>
        </Container>
    );
};

export default Login;
