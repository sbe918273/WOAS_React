import React from "react"
import {
    BarChart, LineChart, XAxis, YAxis, CartesianGrid, Tooltip
  } from 'recharts'

function ScoresLineGraphComponent(props) {

    /* Switch-Case statement sets the appropriate wrapper for the graph components. */

    var DynamicGraphWrapper
    switch (props.graphType) {

        case "line":
            DynamicGraphWrapper = LineChart
            break

        case "bar":
            DynamicGraphWrapper = BarChart
            break

        default:
            DynamicGraphWrapper = BarChart
            break

    }

    /*
        Creates Biaxial Graph that displays all the data in the prop 'scores' that fits within
        the confines of the 'dateRange' prop.
        
    */

    return (

        <table>

            <tr>

                <td style={{width: Math.max(window.screen.width*0.63, 800)}}>

                    <div className="scoresGraph">
                    
                        <DynamicGraphWrapper

                            width={Math.max(window.screen.width*0.63, 800)}
                            height={window.screen.height*0.45}

                            data={props.scores.filter(function(assessment) {
                                return (
                                    assessment.date >= props.dateRange.startDate & 
                                    assessment.date <= props.dateRange.endDate
                                )
                            })}
                            margin={{
                                top: 20, right: 30, left: 20, bottom: 20
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                                dataKey="date" 
                                label={{
                                    value: "Date of Assessment",
                                    position: "bottom",
                                    offset: 0
                                }}
                            />
                            <YAxis 
                                yAxisId="left" 
                                label={{
                                    value: "Topic Scores",
                                    angle: -90,
                                    position: "insideLeft",
                                }}
                            />
                            <YAxis 
                                yAxisId="right"
                                orientation="right"
                                label={{
                                    value: "Weighted Sum of Topic Scores",
                                    angle: -90,
                                    position: "insideTopRight",
                                }} 
                            />

                            <Tooltip />

                            {props.nodeComponents}

                        </DynamicGraphWrapper>

                    </div>

                </td>
                
                <td>

                    <div className="sideBarContainer">
                    
                        <div className="dateRangeInputsContainer">
                                
                            <p 
                                className="dateRangeLabel startDateLabel"
                            > 
                                Start Date:
                                <input
                                    className="dateRangeInput startDateInput"
                                    type="text" 
                                    value={props.tempDateRange.startDate} 
                                    name="startDate" 
                                    onChange={props.handleDateRangeChange}
                                />
                            </p>

                            <p 
                                className="dateRangeLabel endDateLabel"
                            > 
                                End Date:
                                <input
                                    className="dateRangeInput endDateInput"
                                    type="text" 
                                    value={props.tempDateRange.endDate} 
                                    name="endDate" 
                                    onChange={props.handleDateRangeChange}
                                />
                            </p>

                            <button
                                className="dateRangeSubmit"
                                onClick={props.handleDateRangeSubmit}
                            >
                                Change Date Range
                            </button>

                        </div>
                        
                        <div className="scoresGraphLegend">

                            {props.scoreLabels}

                        </div>

                    </div>

                </td>

            </tr>

        </table>
    )
}

export default ScoresLineGraphComponent