import React, { Component } from 'react';
import './Creators.css';

class Creator  extends Component{
  render(){
      return (
        <a href={this.props.link}  className={this.props.className + " creator-item"}>
            <img src={this.props.img} alt="Photo"/><br/>
            <strong  className="creator-name">{this.props.name}</strong><br/>
            <span>{this.props.job}</span>
        </a>
      )
  }
}

class Creators extends Component{

    render(){
        return (
            <div className="creator-layout">
              <h2>Creators</h2>
              <Creator className="creator-one"
                img="/nicolas.jpeg"
                name="Nicolas Mouchel"
                job="Developer"
                link="http://sagix.fr/nicolasmouchel"
              />
              <Creator className="creator-two"
                img="/thomas.jpeg"
                name="Thomas Heutier"
                job="Editor"
                link="https://www.linkedin.com/in/thomas-heurtier-a1207061/"
              />
            </div>
        )
    }
}

export default Creators;
