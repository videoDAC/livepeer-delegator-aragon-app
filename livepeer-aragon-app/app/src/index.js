import '@babel/polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import {AragonApi} from '@aragon/api-react'
import reducer from './app-state-reducer'

ReactDOM.render(
    <AragonApi reducer={reducer}>
        <App />
    </AragonApi>,
    document.getElementById('root')
)
