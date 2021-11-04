import AdminControlComponent from "./AdminControlComponent.js"
import {useHistory} from "react-router-dom"
import React from "react"

function AdminControlContainer(props) {

    const history = useHistory()
    function handleClick(event) {
        const {name} = event.target
        props.setReferrer("/admin")
        history.push(name)
    }

    return (
        <AdminControlComponent
            handleClick={handleClick}
        />
    )
}

export default AdminControlContainer