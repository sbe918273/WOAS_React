import React from 'react'
import ReactDOM from 'react-dom'
import AppContainer from './AppContainer.js'
import {BrowserRouter} from 'react-router-dom';


ReactDOM.render(
    <BrowserRouter>
        <AppContainer/>
    </BrowserRouter>, 
    document.getElementById('root'))