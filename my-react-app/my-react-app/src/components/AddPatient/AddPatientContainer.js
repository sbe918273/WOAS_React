import AddPatientComponent from "./AddPatientComponent.js"
import React, {useState} from "react"
import {useHistory} from "react-router-dom"
import moment from "moment"

function AddPatientContainer(props) {

    const [addPatientInputs, setAddPatientInputs] = useState({
        rio: "",
        admission_date: "",
        first_name: "",
        middle_name: "",
        last_name: "",
      })
    const [addPatientStatus, setAddPatientStatus] = useState({
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

        /* Updates the addPatientInputs state variable object depending on what was changed. */

        const {name, value} = event.target

        setAddPatientInputs(prevAddPatientInputs => ({
            ...prevAddPatientInputs, 
            [name]: value
        }))
    }

    function handleSubmit(event) {

        // Checks if the RiO is completely numeric and 9 digits long.
        if (addPatientInputs.rio.length !== 9 || !/^\d+$/.test(addPatientInputs.rio)){
            setAddPatientStatus(prevAddPatientStatus => ({
                ...prevAddPatientStatus,
                hasFailed: true,
                errorMessage: "The patient's RiO must be completely numeric and 9 digits long."
            }))
            return null
        }

        // Checks if the admission date is in the format DD/MM/YYYY.
        if (!moment(addPatientInputs.admission_date, "DD/MM/YYYY", true).isValid()){
            setAddPatientStatus(prevAddPatientStatus => ({
                ...prevAddPatientStatus,
                hasFailed: true,
                errorMessage: "The admission date provided must be in the format DD/MM/YYYY"
            }))
            return null
        }

        // Sends the request to the add_patient API with the provided patient info in a JSON object.
        event.preventDefault()
        const url = '/api/add_patient'
        fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                ...addPatientInputs,
            }),
            credentials: 'same-origin'
        }).then(res => res.json())
        .then(data => handleAddPatientResponse(data))
    }


    async function handleAddPatientResponse(data) {

        /*
            If the add_patient API request was successful, reset the inputs and show the success message.
            If unsuccessful, show the error message returned by the API.
        */

        if (data.success) {

            setAddPatientInputs(prevAddPatientInputs => ({
                rio: "",
                admission_date: "",
                first_name: "",
                middle_name: "",
                last_name: "",
              }))
              
            setAddPatientStatus(prevAddPatientStatus => ({
                ...prevAddPatientStatus,
                hasFailed: false,
                hasSucceeded: true,
                errorMessage: ""
            }))

        } else {
            setAddPatientStatus(prevAddPatientStatus => ({
                ...prevAddPatientStatus,
                hasFailed: true,
                hasSucceeded: false,
                errorMessage: data.error
            }))
        }
    }

    return (
        <AddPatientComponent 
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            handleClick={handleClick}
            addPatientInputs={addPatientInputs}
            addPatientStatus={addPatientStatus}
        />
    )
}

export default AddPatientContainer
