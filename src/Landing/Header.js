import React, { Component } from 'react';
import logo from './logo.svg';
class Header extends Component{
    render(){
            return (
                <header className="App-header">
                  <img src={logo} className="App-logo" alt="logo of Photogram" />
                  <h1 className="App-title">Photogram</h1>
                  <p>A tool for assistant editor</p>
                </header>
            )
        }
}

export default Header;
