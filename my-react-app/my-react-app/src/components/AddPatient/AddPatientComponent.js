import React from "react"

function AddPatientComponent(props) {

    return ( 

        <div className="credentialFormContainer">

            <p className="logoText">
            <img className="logoImg" src="/imgs/logo.jpg" alt="WOAS logo" />
                WOAS
            </p>

            {props.addPatientStatus.hasFailed && 
                <p className="credentialError">{props.addPatientStatus.errorMessage}</p>
            }

            {props.addPatientStatus.hasSucceeded && 
                <p className="credentialSuccess">Success!</p>
            } 

            <label className="credentialInputLabel" htmlFor="addPatientRioInput">RiO: </label>
            <input
                id="addPatientRioInput"
                className="credentialInput" 
                type="text" 
                name="rio" 
                value={props.addPatientInputs.rio} 
                onChange={props.handleChange}
            />

            <label className="credentialInputLabel" htmlFor="admissionDateInput">Admission Date: </label>
            <input
                id="admissionDateInput"
                className="credentialInput" 
                type="text" 
                name="admission_date" 
                value={props.addPatientInputs.admission_date} 
                onChange={props.handleChange}
                placeholder="DD/MM/YYYY"
            />

            <label className="credentialInputLabel" htmlFor="firstNameInput">(Optional) First Name: </label>
            <input
                id="firstNameInput"
                className="credentialInput" 
                type="text" 
                name="first_name" 
                value={props.addPatientInputs.first_name} 
                onChange={props.handleChange}
            />

            <label className="credentialInputLabel" htmlFor="middleNameInput">(Optional) Middle Name: </label>
            <input
                id="middleNameInput"
                className="credentialInput" 
                type="text" 
                name="middle_name" 
                value={props.addPatientInputs.middle_name} 
                onChange={props.handleChange}
            />

            <label className="credentialInputLabel" htmlFor="lastNameInput">(Optional) Last Name: </label>
            <input
                id="lastNameInput"
                className="credentialInput usernameInput" 
                type="text" 
                name="last_name" 
                value={props.addPatientInputs.last_name} 
                onChange={props.handleChange}
            />

            <button
                id="addPatientSubmitButton"
                className="credentialButton" 
                onClick={props.handleSubmit}>
                Add Patient
            </button>

            <button
                className="credentialButton" 
                name="/admin" 
                onClick={props.handleClick}>
                Back
            </button>
            
        </div>
    )
}

export default AddPatientComponent