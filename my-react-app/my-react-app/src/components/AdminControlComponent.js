import React from "react"

function AdminControlComponent(props) {
    return (
        <div className="credentialFormContainer">

            <button
                className="adminControlButton"
                name="/register" 
                onClick={props.handleClick}>
                Register Account
            </button>

            <button
                className="adminControlButton"
                name="/add-patient" 
                onClick={props.handleClick}>
                Add Patient
            </button>

            <button
                className="adminControlButton"
                name="/view-patient" 
                onClick={props.handleClick}>
                View Patient
            </button>

            <button
                className="adminControlButton"
                name="/assessment" 
                onClick={props.handleClick}>
                Assess Patient
            </button>

            <button
                className="adminControlButton"
                name="/login" 
                onClick={props.handleClick}>
                Back
            </button>

        </div>
    )
}

export default AdminControlComponent