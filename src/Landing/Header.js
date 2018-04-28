import React, { Component } from 'react';
import logo from './logo.svg';
class Header extends Component{
    render(){
            return (
                <header className="App-header">
                  <img src={logo} className="App-logo" alt="logo" />
                  <h1 className="App-title">Welcome to Photogram</h1>
                  <p>This is the new Photogram</p>
                </header>
            )
        }
}

export default Header;
