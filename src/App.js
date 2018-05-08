import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Landing from './Landing';
import Project from './Project';
import './App.css';

class App extends Component {
  render() {
    return (
        <Router>
          <div className="App">
            <Route exact path="/" component={Landing} />
            <Route path="/project/:id" component={Project} />
          </div>
        </Router>
    );
  }
}

export default App;
