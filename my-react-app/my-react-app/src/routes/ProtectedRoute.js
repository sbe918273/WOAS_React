import React from "react"
import checkAuthorized from "../functions/checkAuthorized.js"
import {useState, useEffect} from "react"
import {Redirect} from "react-router-dom"

function ProtectedRoute(props) {

    const [component, setComponent] = useState(null)

    useEffect(() => {checkAuthorized(props.path).then(function(success) {

        if (success) {
            setComponent(<props.component {...props.componentProps}/>)

        } else {

            if (props.path !== "/assessment") {

                checkAuthorized("/assessment").then(function(success) {

                    if (success) {
                        setComponent(<Redirect to={"/assessment"}/>)
                        
                    } else {
                        props.setReferrer(props.path)
                        setComponent(<Redirect to={props.unauthorizedRedirect} />)
                    }

                })
            }

            else {
                props.setReferrer(props.path)
                setComponent(<Redirect to={props.unauthorizedRedirect} />)
            }

    }})}, [props])

    return component ? component : null

}

export default ProtectedRoute