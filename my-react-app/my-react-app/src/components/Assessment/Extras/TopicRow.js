import React from "react"

function TopicRow(props) {

    return (
        <tr>
            <td className="topicCell">{props.topic}</td>
        </tr>
    )
}

export default TopicRow