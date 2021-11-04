import React from "react"
import {Bar} from 'recharts';

function ScoresBar(props) {
    return(
        props.show ?
            <Bar 
                yAxisId={props.side}
                key={props.key}
                type="monotone"
                stackId="a" 
                dataKey={props.topic} 
                fill={props.colour}
                isAnimationActive={false}
            />:
        null
    )
}

export default ScoresBar