import React from "react"

function ScoresGraphLabel(props) {

    return (
        <div>

            <button
                className="legendNode"
                onClick={props.handleLabelClick} 
                name={props.topic}
                style={{
                    textDecoration: props.hidden ? "line-through" : "",
                    display: "inline-block"
                }}
            >

                {props.topic}

                <div 
                    className="colouredBox"
                    style={{
                        width: "20px",
                        height: "20px",
                        backgroundColor: props.colour,
                        display: "inline-block"
                    }}
                ></div>

            </button>

            

        </div>
    )
}

export default ScoresGraphLabel