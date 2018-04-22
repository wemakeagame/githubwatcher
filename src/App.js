import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { ApolloProvider } from "react-apollo"
import { Provider } from "react-redux"

import ProjectsView from './Views/projects.view'
import UserView from './Views/user.view'
import './App.scss'
import { client } from './Config/apollo.client'
import store from "./Config/store"


class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <ApolloProvider client={client} store={store}>
          <Router>
            <div>
              <Route exact path="/" component={ProjectsView} />
              <Route exact path="/user/:id/:repoid" component={UserView} />
            </div>
          </Router>
        </ApolloProvider>
      </Provider>
    );
  }
}

export default App;
