import React from "react"

function StatementRow(props) {
    
    return (
        <tr 
            onChange={event => props.handleAssessmentChange(event, props.topic)}
        >

            <td className="statementCell">{props.statement}</td>

            {props.type === "freq" &&
                [
                    <td className="radioCell"><input className="frequencyRadio" type="radio" name={props.statement} value="never"/></td>,
                    <td className="radioCell"><input className="frequencyRadio" type="radio" name={props.statement} value="single"/></td>,
                    <td className="radioCell"><input className="frequencyRadio" type="radio" name={props.statement} value="multiple"/></td>
                ]
            }
            {props.type === "bool" &&
                [
                    <td className="radioCell"><input className="frequencyRadio" type="radio" name={props.statement} value="false"/></td>,
                    <td className="radioCell"><input className="frequencyRadio" type="radio" name={props.statement} value="true"/></td>
                ]
            }

        </tr>
    )
}

export default StatementRow