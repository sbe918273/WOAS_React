import React from "react"

function RegisterComponent(props) {

    return (
        <div className="credentialFormContainer">

            <p className="logoText">
            <img className="logoImg" src="/imgs/logo.jpg" alt="WOAS logo" />
                WOAS
            </p>

            {props.registerStatus.hasFailed && 
                <p className="credentialError">{props.registerStatus.errorMessage}</p>
            }

            {props.registerStatus.hasSucceeded && 
                <p className="credentialSuccess">Success!</p>
            }

            <label className="credentialInputLabel" htmlFor="registerUserNameInput">Username</label>
            <input
                id="registerUsernameInput"
                className="credentialInput" 
                type="text" 
                name="username" 
                value={props.registerFormInputs.username} 
                onChange={props.handleChange}
            />

            <label className="credentialInputLabel" htmlFor="registerPasswordInput">Password</label>
            <input
                id="registerPasswordInput"
                className="credentialInput"
                type="password" 
                name="password" 
                value={props.registerFormInputs.password} 
                onChange={props.handleChange}
            />

            <label className="credentialInputLabel" htmlFor="registerGroupInput">Group ID</label>
            <input
                id="registerGroupInput"
                className="credentialInput"
                type="text" 
                name="group_id" 
                value={props.registerFormInputs.group_id} 
                onChange={props.handleChange}
            />
            
            <button 
                id="registerSubmitButton" 
                className="credentialButton" 
                name="Register" 
                onClick={props.handleRegister}>
                Register
            </button>

            <button
                id="registerBackButton"
                className="credentialButton" 
                name="/admin" 
                onClick={props.handleClick}>
                Back
            </button>

        </div>
    )
}

export default RegisterComponent