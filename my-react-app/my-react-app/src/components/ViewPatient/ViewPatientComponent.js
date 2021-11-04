import React from "react"
import ScoresGraphContainer from "./ScoresGraph/ScoresGraphContainer"
import AssessmentsTableContainer from "./AssessmentsTable/AssessmentsTableContainer.js"

function ViewPatientComponent(props) {

    return ( 
        <div className="viewPatientConatiner" style={{height: "100vh", width: "100vw"}}> 

            <div className="viewPatientRioContainer">
            <label id="viewPatientRioLabel" >Patient RiO: </label>
            <input 
                id="viewPatientRioInput" 
                type="text" 
                name="rio"
                value={props.patientInputs.rio} 
                onChange={props.handleChange}
            />

            <button
                id="viewPatientRioSubmit"
                onClick={props.handleSubmit}
            >
                View Patient Records
            </button>

            {props.scoresStatus.hasFailed && 
                <p 
                    id="viewPatientRioError"
                    className="credentialError">
                    Invalid RiO!
                </p>
            }

            </div>

            <button
                id="viewPatientBackButton"
                onClick={props.handleClick}
            >
                Back
            </button>

            {props.scoresStatus.isLoading && <h4>Loading...</h4>}

            {Object.values(props.showGraphs).includes(true) && 
                
                <div className="patientRecordsContainer">

                    <hr/>

                    <button 
                        name="scoresBarChart" 
                        className="graphLabel" 
                        onClick={props.handleShow}>

                        {props.showGraphs.scoresBarChart ? "Hide ": "Show "}
                        Bar Chart

                    </button>

                    <div className="scoresGraphContainer">

                        {props.showGraphs.scoresBarChart &&
                            <ScoresGraphContainer
                                scores={props.scores}
                                graphType="bar"
                                topics={props.topics}
                            />
                        }

                    </div>

                    <hr/>

                    <button 
                        name="scoresLineGraph" 
                        className="graphLabel" 
                        onClick={props.handleShow}>

                        {props.showGraphs.scoresLineGraph ? "Hide ": "Show "}
                        Line Graph

                    </button>

                    <div className="scoresGraphContainer">

                        {props.showGraphs.scoresLineGraph &&
                            <ScoresGraphContainer
                                scores={props.scores}
                                graphType="line"
                                topics={props.topics}
                            />
                        }                    

                    </div>

                    <hr/>

                    <button 
                        name="assessmentsTable" 
                        className="graphLabel" 
                        onClick={props.handleShow}>

                        {props.showGraphs.assessmentsTable ? "Hide ": "Show "}
                        Table of Assessments

                    </button>

                    <div className="scoresGraphContainer">

                        {props.showGraphs.assessmentsTable &&
                            <AssessmentsTableContainer
                                tableData={props.tableData}
                            />
                        }

                    </div>

                    <hr/>

                </div>
            }

        </div>
    )
}

export default ViewPatientComponent