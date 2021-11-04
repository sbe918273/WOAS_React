import RegisterComponent from "./RegisterComponent.js"
import React, {useState} from "react"
import {useHistory} from "react-router-dom"

function RegisterContainer(props) {

    const [registerFormInputs, setRegisterFormInputs] = useState({
        username: "",
        password: "",
        group_id: ""
      })
    const [registerStatus, setRegisterStatus] = useState({
        hasFailed: false,
        hasSucceeded: false,
        errorMessage: ""
    })
    const history = useHistory()
    function handleClick(event) {
        history.push(props.referrer)
        props.setReferrer("")
    }
    
    function handleChange(event) {

        /* Updates register inputs according to what was changed. */

        const {name, value} = event.target
        setRegisterFormInputs(prevRegisterFormInputs => ({
            ...prevRegisterFormInputs, [name]: value
        }))
    }

    function handleRegister(event) {

        /*
            Sends request to register API with register inputs parameters found in the registerFormInputs state if
            they have all been provided. The data returned by the API is then sent to the handleRegisterResponse function.
        */

        if (Object.values(registerFormInputs).includes("")){
            setRegisterStatus(prevRegisterStatus => ({
                ...prevRegisterStatus,
                hasFailed: true,
                hasSucceeded: false,
                errorMessage: 'Fill in both boxes!'
            }))
        }

        event.preventDefault()
        const url = '/api/register'
        fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                ...registerFormInputs,
            }),
            credentials: 'same-origin'
        }).then(res => res.json())
        .then(data => handleRegisterResponse(data))
    }


    async function handleRegisterResponse(data) {

        /*
            Resets register inputs and if the API request was successful, display the success message. If not, display
            the error message returned from the API.
        */

        setRegisterFormInputs(prevRegisterFormInputs => ({
            username: "",
            password: "",
            group_id: ""
        }))

        if (data.success) {
            setRegisterStatus(prevRegisterStatus => ({
                ...prevRegisterStatus,
                hasFailed: false,
                hasSucceeded: true,
                errorMessage: ""
            }))

        } else {
            setRegisterStatus(prevRegisterStatus => ({
                ...prevRegisterStatus,
                hasFailed: true,
                hasSucceeded: false,
                errorMessage: data.error
            }))
        }
    }

    return (
        <RegisterComponent 
            handleRegister={handleRegister}
            handleClick={handleClick}
            handleChange={handleChange}
            registerFormInputs={registerFormInputs}
            registerStatus={registerStatus}
        />
    )
}

export default RegisterContainer
