import React, {useState, useEffect} from "react"
import ScoresBar from "./Extras/ScoresBar.js"
import ScoresLine from "./Extras/ScoresLine.js"
import ScoresLabel from "./Extras/ScoresLabel.js"
import ScoresGraphComponent from "./ScoresGraphComponent.js"
import moment from "moment"

function ScoresGraphContainer(props) {

    const [showTopics, setShowTopics] = useState({})
    const [dateRange, setDateRange] = useState({
        startDate: "",
        endDate: ""
    })

    const [tempDateRange, setTempDateRange] = useState({
        startDate: "",
        endDate: ""
    })

    const nodeColours = [
        "#A7226E", "#EC2049", "#F26B38", "#F7DB4F", "#2F9599", 
        "#FF4E50", "#EDE574", "#F9D423", "#FC913A", "#E1F5C4"  
    ]

    function handleLabelClick(event) {

         /* Hides/Shows the topic of the label clicked on the graph. */

        const {name} = event.target

        setShowTopics(prevShowTopics => ({
            ...prevShowTopics,
            [name]: !prevShowTopics[name]
        }))

    }

    function handleDateRangeChange (event) {

        const {name, value} = event.target

        setTempDateRange(prevTempDateRange => ({
            ...prevTempDateRange,
            [name]: value
        }))
    
    }

    function handleDateRangeSubmit() {

        /* 
            If the selected new starting date is before than the ending date chosen,
                If the starting date is within the scores (i.e. after the first date listed
                in the scores),
                    Set the starting date to be what was selected.
                If the starting date is not within the scores (i.e before the first date listed
                in the scores),
                    Set the starting date to the first date within the scores.

            If the selected new starting date is after the ending date chosen (and thus invalid),
                Dont change the starting date.
        */

        if ((!moment(tempDateRange.startDate, "YYYY-MM-DD", true).isValid()) ||
            (!moment(tempDateRange.endDate, "YYYY-MM-DD", true).isValid())
        ){
            return null
        }

        const firstDate = props.scores[0].date
        var newStartDate
        if (tempDateRange.startDate > firstDate) {
            newStartDate = tempDateRange.startDate
        } else {
            newStartDate = firstDate
        }

        const lastDate = props.scores[props.scores.length-1].date
        if (tempDateRange.endDate > newStartDate){

            var newEndDate
            if (tempDateRange.endDate < lastDate) {
                newEndDate = tempDateRange.endDate
            } else {
                newEndDate = lastDate
            }

        } else {
            return null
        }

        setDateRange(() => ({
            startDate: newStartDate,
            endDate: newEndDate
        }))
    }

    useEffect(() => {

        /* 
            When the prop 'topics' is set (which will only happen once), show all the topics on the graph.
            I.e. set the showTopics state to {topic1: true, topic2: true...}
            where the topics above are all found in the array props.topics.
        */

        setShowTopics(() => 
            Object.assign(
                ...(props.topics.map(topic => ({ [topic]: true }))).concat({"Weighted Sum": true})
            )
        )

    }, [props.topics])

    useEffect(function() {

        /*
            When the component mounts (NB: setDateRange and props.scores will not again change after mounting):
            Set the default starting date to the date of an assessment 8 rows from the end of the scores list.
            Sets the default ending date to the date of the last assessment in the scores list.
        */

        const lastDate = props.scores[props.scores.length - 1].date
        const priorDate = props.scores[Math.max((props.scores.length - 8), 0)].date
        
        setDateRange({
            startDate: priorDate,
            endDate: lastDate
        })

        setTempDateRange({
            startDate: priorDate,
            endDate: lastDate
        })

    }, [setDateRange, props.scores])


    var nodeComponents = []
    var scoreLabels= []

    /* 
        On re-render, reset the graph.
        For each topic, add a new scoreLabel (i.e an entry in the graph legend) 
        and an entry in the graph, depending on wheter it is a line or bar graph.
        The colour of each graph node component is chosen incrementally from the
        nodeColours array.
    */

    Object.keys(showTopics).map(function(topic, idx) {

        const side = (topic === "Weighted Sum") ? "right" : "left"

        scoreLabels.push(
            <ScoresLabel
                topic={topic}
                key={idx}
                hidden={!showTopics[topic]}
                colour={nodeColours[idx]}
                handleLabelClick={handleLabelClick}
            />
        )

        const newNodeProps = {
            show: showTopics[topic],
            key: idx,
            side: side,
            topic: topic,
            colour: nodeColours[idx]
        }

        var newNodeComponent
        if (props.graphType === "line") {
            newNodeComponent = ScoresLine(newNodeProps)
        } else if (props.graphType === "bar") {
            newNodeComponent = ScoresBar(newNodeProps)
        }

        nodeComponents.push(newNodeComponent)
        return null
    })

    return (
        <ScoresGraphComponent
            scores={props.scores}
            graphType={props.graphType}
            nodeComponents={nodeComponents}
            scoreLabels={scoreLabels}
            dateRange={dateRange}
            tempDateRange={tempDateRange}
            handleDateRangeChange={handleDateRangeChange}
            handleDateRangeSubmit={handleDateRangeSubmit}
        />
    )
}

export default ScoresGraphContainer