import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
class ListProject extends Component{

    render(){
        return (
            <ul>{this.props.value.map((project) => {
                return (
                  <li key={project.name}>
                    <h2><Link to={"/project/" + project.key}>{project.name}</Link></h2>
                  </li>
                );
            })}</ul>
        )
    }
}

export default ListProject;
