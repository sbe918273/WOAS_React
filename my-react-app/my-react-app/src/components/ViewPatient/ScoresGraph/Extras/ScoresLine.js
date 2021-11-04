import React from "react"
import {Line} from 'recharts';

function ScoresLine(props) {
    return(
        props.show ?
            <Line 
                yAxisId={props.side}
                key={props.key}
                type="monotone" 
                strokeWidth="2px"
                dataKey={props.topic} 
                stroke={props.colour}
                activeDot={{ r: 8 }} 
                isAnimationActive={false}
            />:
        null
    )
}

export default ScoresLine