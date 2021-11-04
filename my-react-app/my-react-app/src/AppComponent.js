import React from "react"
import LoginContainer from "./components/Login/LoginContainer.js"
import RegisterContainer from "./components/Register/RegisterContainer.js"
import AdminControlContainer from "./components/AdminControlContainer.js"
import AssessmentContainer from "./components/Assessment/AssessmentContainer.js"
import AddPatientContainer from "./components/AddPatient/AddPatientContainer.js"
import ViewPatientContainer from "./components/ViewPatient/ViewPatientContainer.js"
import {Route, Switch} from "react-router-dom"
import ProtectedRoute from "./routes/ProtectedRoute.js"

function AppComponent(props) {

    return (
            <Switch>
                <Route 
                    exact path={["/login", "/"]}
                    render={() => <LoginContainer
                        setCredentials={props.setCredentials}
                        referrer={props.referrer}
                        setReferrer={props.setReferrer}
                    />}
                />
                <ProtectedRoute
                    path="/admin"
                    exact={true}
                    setReferrer={props.setReferrer}
                    unauthorizedRedirect="/login"
                    component={AdminControlContainer}
                    componentProps={{
                        credentials: props.credentials,
                        referrer: props.referrer,
                        setReferrer: props.setReferrer
                    }}
                />
                <ProtectedRoute
                    path="/register"
                    exact={true}
                    setReferrer={props.setReferrer}
                    unauthorizedRedirect="/login"
                    component={RegisterContainer}
                    componentProps={{
                        credentials: props.credentials,
                        referrer: props.referrer,
                        setReferrer: props.setReferrer
                    }}
                />
                <ProtectedRoute
                    path="/add-patient"
                    exact={true}
                    setReferrer={props.setReferrer}
                    unauthorizedRedirect="/login"
                    component={AddPatientContainer}
                    componentProps={{
                        credentials: props.credentials,
                        referrer: props.referrer,
                        setReferrer: props.setReferrer
                    }}
                />
                <ProtectedRoute
                    path="/assessment"
                    exact={true}
                    setReferrer={props.setReferrer}
                    unauthorizedRedirect="/login"
                    component={AssessmentContainer}
                    componentProps={{
                        credentials: props.credentials,
                        referrer: props.referrer,
                        setReferrer: props.setReferrer
                    }}
                />
                <ProtectedRoute
                    path="/view-patient"
                    exact={true}
                    setReferrer={props.setReferrer}
                    unauthorizedRedirect="/login"
                    component={ViewPatientContainer}
                    componentProps={{
                        credentials: props.credentials,
                        referrer: props.referrer,
                        setReferrer: props.setReferrer
                    }}
                />
            </Switch>
        )
}

export default AppComponent