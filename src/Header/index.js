import React, { Component } from 'react';
import logo from './logo.svg';
import './index.css';
class Header extends Component{
    render(){
            return (
                <header className="header-container">
                  <img src={logo} className="header-logo" alt="logo of Photogram"/>
                  <a className="header-text" href="/">
                      <h1 className="App-title">Photogram</h1>
                      <p>A tool for assistant editor</p>
                  </a>
                  <nav className="header-nav">
                    <ul>
                       <li><a href="/projects" className={`${this.props.nav === "projects" ? "selected" : ""}`}>Projects</a></li>
                       <li><a href="/tutorial" className={`${this.props.nav === "tutorial" ? "selected" : ""}`}>Tutorial</a></li>
                       <li><a href="/project-demo">Demo</a></li>
                    </ul>
                  </nav>
                </header>
            )
        }
}

export default Header;
