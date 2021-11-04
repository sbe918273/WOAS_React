import React, { useState, useEffect } from "react"
import AssessmentsTableComponent from "./AssessmentsTableComponent.js"
import moment from "moment"

function AssessmentsTableContainer(props) {

    // The initial information the table displays is about the first topic in the first row in the scores.

    const [tableDate, setTableDate] = useState(Object.keys(props.tableData)[0])
    const [tempTableDate, setTempTableDate] = useState(Object.keys(props.tableData)[0])

    const [tableTopic, setTableTopic] = useState(Object.keys(Object.values(props.tableData)[0])[0])
    const [topicComponents, setTopicComponents] = useState([])

    function handleDateSubmit() {

        if ((!moment(tempTableDate, "YYYY-MM-DD", true).isValid()) ||
            (!props.tableData.hasOwnProperty(tempTableDate))
        ){
            return null
        }

        setTableDate(tempTableDate)
        setTableTopic(Object.keys(props.tableData[tableDate])[0])
    }

    function handleDateChange(event) {

        /*
            If the tableData prop has an entry for the date selected, set the date to
            be the one selected, and the topic to be the first topic in said entry. 
        */

        const {value} = event.target
        setTempTableDate(() => value)

    }

    useEffect(function() {

        function handleClick(event) {

            /* Sets the assessments table to display the topic selected. */
    
            const {name} = event.target
            setTableTopic(name)
    
        }

        /*
            When the tableDate or tableTopic prop changes (i.e. the information the table displays changes), 
            re-render a component for each topic in the entry being displayed that allows 
            the tableTopic prop to be changed to that topic (with the selected one now being darker than the rest). 
            Set the topicComponents state to an array of these topic components.
        */

        setTopicComponents(() =>
            Object.keys(props.tableData[tableDate]).map((topic, idx) => 
                <button key={idx}
                    className="tableLegendNode"
                    onClick={(event) => handleClick(event)}
                    name={topic}
                    style={{
                        backgroundColor: (tableTopic === topic) ? "#808080" : "#F5F5F5"
                    }}
                >
                    {topic}
                </button>
        ))

    }, [tableTopic, tableDate, props.tableData, setTopicComponents, setTableTopic])

    return (
        <AssessmentsTableComponent
            tableData={props.tableData}
            tableDate={tableDate}
            tempTableDate={tempTableDate}
            tableTopic={tableTopic}
            handleDateChange={handleDateChange}
            handleDateSubmit={handleDateSubmit}
            topicComponents={topicComponents}
        />
    )

}

export default AssessmentsTableContainer