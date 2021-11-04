import React from "react"

function LoginComponent(props) {

    return ( 
        <div className="credentialFormContainer">

            <p className="logoText">
            <img className="logoImg" src="/imgs/logo.jpg" alt="WOAS logo" />
                WOAS
            </p>

                {props.loginStatus.hasFailed && 
                    <p className="credentialError">{props.loginStatus.errorMessage}</p>
                }

                <label className="credentialInputLabel" htmlFor="loginUserNameInput">Username</label>
                <input
                    id="loginUsernameInput"
                    className="credentialInput" 
                    type="text" 
                    name="username" 
                    value={props.loginFormInputs.username} 
                    onChange={props.handleChange}
                />

                <label className="credentialInputLabel" htmlFor="loginPasswordInput">Password</label>
                <input
                    id="loginPasswordInput"
                    className="credentialInput"
                    type="password" 
                    name="password" 
                    value={props.loginFormInputs.password} 
                    onChange={props.handleChange}
                />
                
                <button 
                    id="loginSubmitButton" 
                    className="credentialButton" 
                    name="Login" 
                    onClick={props.handleLogin}>
                    Login
                </button>

        </div>
    )
}

export default LoginComponent