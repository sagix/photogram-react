import React, { Component } from 'react';
import logo from './logo.svg';
import Projects from './Projects';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Photogram</h1>
          <p>This is the new Photogram</p>
        </header>
        <Projects />
      </div>
    );
  }
}

export default App;
