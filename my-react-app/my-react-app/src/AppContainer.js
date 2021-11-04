import React, {useState} from "react"
import AppComponent from "./AppComponent.js"

function AppContainer() {

    const [referrer, setReferrer] = useState("")

    const [credentials, setCredentials] = useState({
        isLogged: false,
        username: "",
      })

    return (
        <AppComponent 
            credentials={credentials}
            setCredentials={setCredentials}
            referrer={referrer}
            setReferrer={setReferrer}
        /> 
    )
}
export default AppContainer