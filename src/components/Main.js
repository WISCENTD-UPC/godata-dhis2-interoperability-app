import React from 'react'
import {
  HashRouter as Router,
  Switch,
  Route,
} from 'react-router-dom'
import FileForm from './FileForm'
import Form from './Form'
import SideBar from './SideBar'
import Actions from '../api/Actions'

const Main = () => (
  <Router>
      <SideBar />
      <Switch>
        <Route exact path="/credentials" component={ FileForm }/>
        <Route exact path="/settings" component={ Form }/>
        <Route exact path="/export" component={ Actions }/>
      </Switch>
  </Router>
)

export default Main
