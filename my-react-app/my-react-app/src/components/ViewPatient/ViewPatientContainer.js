import ViewPatientComponent from "./ViewPatientComponent.js"
import React, {useState} from "react"
import {useHistory} from "react-router-dom"

function ViewPatientContainer(props) {

    const [topics, setTopics] = useState([])
    const [scores, setScores] = useState([])

    const [tableData, setTableData] = useState({})
    const [showGraphs, setShowGraphs] = useState({
        scoresLineGraph: false,
        scoresBarChart: false,
        assessmentsTable: false
    })
    
    const [patientInputs, setPatientInputs] = useState({
        'rio': ''
    })
    const [scoresStatus, setScoresStatus] = useState({
        hasFailed: false,
        isLoading: false,
    })
    const history = useHistory()

    function handleClick() {
        history.push(props.referrer)
        props.setReferrer("")
    }

    function handleShow(event) {
        const {name} = event.target
        setShowGraphs(prevShowGraphs => ({
            ...prevShowGraphs,
            [name]: !prevShowGraphs[name]
        }))
    }

    function handleChange(event) {
        const {name, value} = event.target
        setPatientInputs(prevPatientInputs => ({
            ...prevPatientInputs,
            [name]: value
        }))
    }

    function handleSubmit(event) {
        event.preventDefault()

        setScoresStatus(prevScoresStatus => ({
            ...prevScoresStatus,
            isLoading: true
        }))

        const url = "/api/view_patient"
        fetch(url, {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                "auth_token": props.credentials.authToken,
                "rio": patientInputs.rio
            })
        }).then(res => res.json())
        .then(function(data) {

            if (data.success) {

                setScores(data.scores)
                setTopics(data.topics)
                setTableData(data.table_data)

                setScoresStatus(prevScoresStatus => ({
                    ...prevScoresStatus,
                    isLoading: false,
                    hasFailed: false
                }))
                setShowGraphs(prevShowGraphs => ({
                    ...prevShowGraphs,
                    scoresLineGraph: true,
                    scoresBarChart: true,
                    assessmentsTable: true
                }))

            } else {
                setScoresStatus(prevScoresStatus => ({
                    ...prevScoresStatus,
                    isLoading: false,
                    hasFailed: true
                }))
            }
        })
    }


    return (
        <ViewPatientComponent 
            patientInputs={patientInputs}
            scoresStatus={scoresStatus}
            showGraphs={showGraphs}
            scores={scores}
            tableData={tableData}
            topics={topics}
            handleClick={handleClick}
            handleChange={handleChange}
            handleShow={handleShow}
            handleSubmit={handleSubmit}
        />
    )
}

export default ViewPatientContainer