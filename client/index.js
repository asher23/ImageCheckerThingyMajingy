import './index.scss'
import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import store from './store'
import Routes from './routes'
import DrawingBoard from './components/drawingBoard'
import Home from './components/home'
import Konva from './components/konva'
// establishes socket connection
import './socket'

ReactDOM.render(
  <div>
      <Home/>
  </div>,
  document.getElementById('app'));
