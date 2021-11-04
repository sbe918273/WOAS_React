import React from "react"

function AssessmentComponent(props) {

    return (
        
        <div className="assessmentForm">

            <label className="assessmentLabel" htmlFor="assessmentRioInput">Patient RiO: </label>
            <input 
                id="assessmentRioInput" 
                className="assessmentInput" 
                type="text" 
                name="rio" 
                onChange={props.handleChange}
            />

            <label className= "assessmentLabel" htmlFor="date">Date: </label>
            <input 
                id="assessmentDateInput"
                className="assessmentInput" 
                type="text" 
                name="assessment_date" 
                onChange={props.handleChange} 
                placeholder="DD/MM/YYYY"
            />
            
            <button className="assessmentBackButton" onClick={props.handleClick}>Back</button>

            {props.assessmentStatus.hasFailed && <p className="assessmentError">{props.assessmentStatus.errorMessage}</p>}
            {props.assessmentStatus.hasSucceeded && 
                <p className="assessmentSuccess">Success!</p>
            }
            {props.assessmentStatus.isLoading && <p className="assessmentLoading">Loading...</p>}

            <table>
                <tbody>
                    {props.criteriaComponents}
                </tbody>
            </table>

            {!props.assessmentStatus.isLoading && <button className="assessmentButton" onClick={props.handleSubmit}>Submit Assessment</button>}

        </div>
    )

}

export default AssessmentComponent