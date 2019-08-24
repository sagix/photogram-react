import React, { Component } from 'react';
import { Router, Route } from "react-router-dom";
import Landing from './Landing';
import Project from './Project';
import Tutorial from './Tutorial';
import ReactGA from 'react-ga';
import history from './history';
import './App.css';

ReactGA.initialize('UA-5120082-4');
// Initialize google analytics page view tracking
history.listen(location => {
  ReactGA.set({ page: location.pathname }); // Update the user's current page
  ReactGA.pageview(location.pathname); // Record a pageview for the given page
});

class App extends Component {

  componentDidMount() {
    ReactGA.pageview(window.location.pathname)
  }

  render() {
    return (
        <Router history={history}>
          <div className="App">
            <Route exact path="/" component={Landing} />
            <Route exact path="/tutorial" component={Tutorial} />
            <Route path="/project/:id" component={Project} />
          </div>
        </Router>
    );
  }
}

export default App;
