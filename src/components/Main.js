import React from 'react'
import {
  HashRouter as Router,
  Switch,
  Route,
} from 'react-router-dom'
import Cryptr from 'cryptr'
import FileForm from './FileForm'
import Form from './Form'
import SideBar from './SideBar'
import Actions from '../api/Actions'

const Main = () => {
  const cryptr = new Cryptr(process.env.REACT_APP_SECRET_KEY)
  return (
    <Router>
        <div className="layout-container">
          <SideBar />
          <Switch>
            <Route exact path="/credentials" render={ () => <FileForm cryptr={ cryptr }/> }/>
            <Route exact path="/settings" component={ Form }/>
            <Route exact path="/export" render={ () => <Actions cryptr={ cryptr }/> }/>
          </Switch>
        </div>
    </Router>
  )
}

export default Main
