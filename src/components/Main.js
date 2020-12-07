import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom'
import FileForm from './FileForm'
import Form from './Form'
import SideBar from './SideBar'

const Main = () => (
    <Router>
        <SideBar />
        <Switch>
          <Route exact path="/credentials" component={ FileForm }/>
          <Route path="/settings" component={ Form }/>
        </Switch>
    </Router>
)

export default Main

/*<Route exact path="/">
    <Home />
</Route>*/