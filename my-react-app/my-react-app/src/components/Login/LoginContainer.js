import LoginComponent from "./LoginComponent.js"
import React, {useState} from "react"
import {useHistory} from "react-router-dom"

function LoginContainer(props) {

    const history = useHistory()

    const [loginFormInputs, setLoginFormInputs] = useState({
        username: "admin",
        password: "areyoudaftnigela2812"
      })

    const [loginStatus, setLoginStatus] = useState({
        hasFailed: false
    })

    function handleChange(event) {

        /* Updates login inputs according to what was changed. */

        const {name, value} = event.target
        setLoginFormInputs(prevLoginFormInputs => ({
            ...prevLoginFormInputs, [name]: value
        }))

    }

    function handleLogin(event) {

        /*
            Sends POST authentication request to login API with username and password 
            parameters found in the loginFormInputs state.
            The data received is sent to the handleLoginResponse function
        */

        event.preventDefault()

        const url = '/api/login'
        fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(loginFormInputs),
        }).then(res => res.json())
        .then(data => handleLoginResponse(data))

    }

    async function handleLoginResponse(data) {

        /*
            Resets password input. If the login API request was successful and the username/password were valid,
            an authorization POST request is sent regarding the referrer to the login (or the assessment page if the
            referrer is blank).
        */

        console.log(data)

        setLoginFormInputs(prevLoginFormInputs => ({
            ...prevLoginFormInputs,
            password: ""
        }))

        if (data.success) {

            setLoginStatus(prevLoginStatus => ({
                ...prevLoginStatus,
                hasFailed: false,
                errorMessage: ""
            }))
            props.setCredentials(() => ({
                isLogged: true,
                username: loginFormInputs.username,
            }))
            
            const redirectPath = (props.referrer !== "" && props.referrer !== "/login") ? props.referrer : "/assessment"
            props.setReferrer("/login")
            history.push(redirectPath)

        } else {
            setLoginStatus(prevLoginStatus => ({
                ...prevLoginStatus,
                hasFailed: true,
                errorMessage: data.error
            }))
        }
    }

    return <LoginComponent 
        handleLogin={handleLogin}
        handleChange={handleChange}
        loginFormInputs={loginFormInputs}
        loginStatus={loginStatus}
    /> 

}

export default LoginContainer
