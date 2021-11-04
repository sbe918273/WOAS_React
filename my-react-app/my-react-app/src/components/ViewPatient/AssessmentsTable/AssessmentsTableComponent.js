import React from "react"

function AssessmentsTableComponent(props){

    return(
        <div className="assessmentsTableContainer">


            <label
                className="tableDateLabel"
            > 
                Assessment Date:
                
            </label>

            <input
                className="tableDateInput"
                value={props.tempTableDate} 
                name="assessment_date" 
                onChange={props.handleDateChange}
            />

            <button
                className="tableDateSubmit"
                onClick={props.handleDateSubmit}
            >
                Change Assessment Date
            </button>

            <div className="tableLegendContainer">
                {props.topicComponents}
            </div>

            <table className="assessmentsTable">
                <tbody>

                    <tr>
                        <th>Statement</th>
                        <th>Frequency</th>
                    </tr>

                    {/*
                        Create a row with the format "| statement | frequency | for each entry in the tableData prop."
                    */}

                    {Object.keys(props.tableData[props.tableDate][props.tableTopic]).map((statement, idx) => (
                        <tr key={idx}>
                            <td>{statement}</td>
                            <td>{props.tableData[props.tableDate][props.tableTopic][statement]}</td>
                        </tr>
                    ))}

                </tbody>
            </table>
            
        </div>
    )
}

export default AssessmentsTableComponent