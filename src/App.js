import React, { Component } from 'react';
import { Router, Route } from "react-router-dom";
import Landing from './Landing';
import Projects from './Projects';
import Project from './Project';
import Demo from './Demo';
import PrivacyPolicy from './PrivacyPolicy';
import Tutorial from './Tutorial';
import Fixor from './Fixor';
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
      <React.StrictMode>
        <Router history={history}>
          <div className="App">
            <Route exact path="/" component={Landing} />
            <Route exact path="/tutorial" component={Tutorial} />
            <Route exact path="/projects" component={Projects} />
            <Route exact path="/project/:id" component={Project} />
            <Route exact path="/project-demo" component={Demo} />
            <Route exact path="/privacy-policy" component={PrivacyPolicy} />
            <Route exact path="/fixor" component={Fixor} />
          </div>
        </Router>
      </React.StrictMode>
    );
  }
}

export default App;
