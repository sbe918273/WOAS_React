import AssessmentComponent from "./AssessmentComponent.js"
import React, {useState, useEffect} from "react"
import TopicRow from "./Extras/TopicRow.js"
import StatementRow from "./Extras/StatementRow.js"
import FrequencyHeader from "./Extras/FrequencyHeader.js"
import moment from "moment"
import {useHistory} from "react-router-dom"

function AssessmentContainer(props) {

    const [criteria, setCriteria] = useState({})
    const [criteriaInputs, setCriteriaInputs] = useState({})
    const [criteriaComponents, setCriteriaComponents] = useState([])
    const [assessmentDetails, setAssessmentDetails] = useState({
        rio: "",
        assessment_date: ""
    })
    const [assessmentStatus, setAssessmentStatus] = useState({
        hasFailed: false,
        hasSucceeded: false,
        isLoading: false,
        errorMessage: ""
    }) 

    const history = useHistory()
    function handleClick(event) {
        history.push(props.referrer)
        props.setReferrer("")
    }

    useEffect(() => {

            /*
                When the page loads, get the assessment criteria from the get_criteria API and set it to
                the criteria state variable if successful. If unsuccessful, redirect to the login page.
            */

            setAssessmentStatus(prevAssessmentStatus => ({
                ...prevAssessmentStatus,
                isLoading: true
            }))

            const url = "/api/get_criteria"
            fetch(url, {
                method: 'POST',
                headers: {"Content-Type": "application/json"},
                credentials: 'same-origin'
            }).then(res => res.json())
            .then(function(data) {

                setAssessmentStatus(prevAssessmentStatus => ({
                    ...prevAssessmentStatus,
                    isLoading: false
                }))

                data.success ? setCriteria(data.criteria) : history.push("/login")
            })

    }, [props.credentials, history])

    useEffect(() => {

        function handleAssessmentChange(event, topic) {

            /*
                Find the frequency number inputted based off the statement that was clicked's setting 
                and set that statement's value in the criteriaInputs object to that number.
            */

            const {name, value} = event.target
            var frequency
    
            if (criteria[topic][name].type === "freq") {
                switch (value) {
                    case "never" :
                        frequency = 0
                        break
                    case "single" :
                        frequency = 1
                        break
                    case "multiple" :
                        frequency = 2
                        break
                    default:
                        frequency = null
                        break
                }
            } else if (criteria[topic][name].type === "bool") {
                switch (value) {
                    case "false" :
                        frequency = 0
                        break
                    case "true" :
                        frequency = 1
                        break
                    default:
                        frequency = null
                        break
                }
            }
    
            setCriteriaInputs(prevCriteriaInputs => ({
                ...prevCriteriaInputs,
                [topic]: {
                    ...prevCriteriaInputs[topic],
                    [name] : frequency
                }
            }))  
        }

        /* 
            When the critieria updates create an criteria inputs template object with the format {topic: {statement: null}}.
            For each topic create a topic row, followed by one row for each of its statements with their radio checkboxes. Once compiled,
            these componnets are set to the criteriaComponets state variable. If the input type changes (e.g. from 'freq' to 'bool') a 
            new frequency header row is appended to label the following radio buttons.
        */

        const criteriaInputsTemplate = {}

        for (const topic of Object.keys(criteria)){
            criteriaInputsTemplate[topic] = {}
            for (const statement of Object.keys(criteria[topic])){
                criteriaInputsTemplate[topic][statement] = null
            }
        }

        setCriteriaInputs(() => criteriaInputsTemplate)

        const tempCriteriaComponents = []
        var currentType = ""
        for (const topic of Object.keys(criteria)) {

            tempCriteriaComponents.push(<TopicRow topic={topic}/>)
    
            for (const statement of Object.keys(criteria[topic])) {

                const type = criteria[topic][statement].type

                if (type !== currentType) {
                    
                    currentType = type
                    tempCriteriaComponents.push(<FrequencyHeader type={type}/>)
                }

                tempCriteriaComponents.push(
                    <StatementRow
                        topic={topic}
                        statement={statement}
                        type={type}
                        handleAssessmentChange={handleAssessmentChange}
                    />
                )
            }
        }

        console.log(tempCriteriaComponents)

        setCriteriaComponents(() => tempCriteriaComponents)

    }, [criteria, setCriteriaInputs])

    function handleChange(event) {

        /* Updates the selected assessment detail with what was inputted */

        const {name, value} = event.target
        setAssessmentDetails(prevAssessmentDetails => ({
            ...prevAssessmentDetails,
            [name]: value
        }))
    }

    async function handleAssessmentResponse(data) {

        /*
            If the request to the sumbit_assessment API was successful, remove the error message. If not, display the error message
            returned by said API.
        */

        if (data.success) {
            setAssessmentStatus(prevAssessmentStatus => ({
                ...prevAssessmentStatus,
                hasFailed: false,
                errorMessage: "",
                hasSucceeded: true
            }))
        } else {
            setAssessmentStatus(prevAssessmentStatus => ({
                ...prevAssessmentStatus,
                hasFailed: true,
                errorMessage: data.error,
                hasSucceeded: false
            }))
        }
    }

    function handleSubmit() {

        /* 
            Iterate recurivsely through the criteriaInputs object. If any values for the frequency of any statements is null,
            (i.e. the default value) that statement has not been checked and the inputs are thus not valid.
        */

        for(const topic of Object.values(criteriaInputs)){
            for (const frequency of Object.values(topic)) {
                if (frequency === null) {
                    setAssessmentStatus(prevAssessmentStatus => ({
                        ...prevAssessmentStatus,
                        hasFailed: true,
                        hasSucceeded: false,
                        errorMessage: "Exactly one box must be checked for each statement!"
                    }))
                    return null
                }
            }
        }

        // Checks if the RiO is completely numeric and 9 digits long.
        if (assessmentDetails.rio.length !== 9 || !/^\d+$/.test(assessmentDetails.rio)){
            setAssessmentStatus(prevAssessmentStatus => ({
                ...prevAssessmentStatus,
                hasFailed: true,
                hasSucceeded: false,
                errorMessage: "The patient's RiO must be completely numeric and 9 digits long."
            }))
            return null
        }

        // Checks if the assessment date is in the format DD/MM/YYYY.
        if (!moment(assessmentDetails.assessment_date, "DD/MM/YYYY", true).isValid()){
            setAssessmentStatus(prevAssessmentStatus => ({
                ...prevAssessmentStatus,
                hasFailed: true,
                hasSucceeded: false,
                errorMessage: "The assessment date provided must be in the format DD/MM/YYYY"
            }))
            return null
        }

        // Send the request to the submit_assessment API.
        const url = "/api/submit_assessment"
        fetch(url, {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                ...assessmentDetails,
                criteria: {...criteriaInputs},
            }),
            credentials: 'same-origin'
        }).then(res => res.json())
        .then(data => handleAssessmentResponse(data))

    }

    return (
        <AssessmentComponent 
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            handleClick={handleClick}
            criteriaComponents={criteriaComponents}
            criteriaInputs={criteriaInputs}
            assessmentStatus={assessmentStatus}
        />
    )
}

export default AssessmentContainer