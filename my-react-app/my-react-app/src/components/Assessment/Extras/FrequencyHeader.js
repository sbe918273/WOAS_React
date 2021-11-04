import React from "react"

function FrequencyHeader(props) {
    
    return (
        <tr>

            <th className="statementCell"> </th>

            {props.type === "freq" && [
                <th className="frequencyCell">Never</th>,
                <th className="frequencyCell">Once</th>,
                <th className="frequencyCell">Multiple</th>
            ]}

            {props.type === "bool" && [
                <th className="frequencyCell">False</th>,
                <th className="frequencyCell">True</th>
            ]}

        </tr>
    )
}

export default FrequencyHeader